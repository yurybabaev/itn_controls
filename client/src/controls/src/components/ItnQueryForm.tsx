import React, { useCallback, useImperativeHandle, useState, useRef, useMemo, useEffect } from "react";
import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import { IFormRef } from "../base/IFormRef";
import { LooseObject } from "../base/LooseObject";
import { createEntity, deleteEntity, getDict, getEntity, updateEntity, IFormMutateParams } from "../queries/dataQueries";
import { AxiosError, AxiosResponse } from "axios";
import IQueryFormProps from "../props/IQueryFormProps";
import ItnBaseForm from "./ItnBaseForm";
import { IQueryFormRef } from "../base/IQueryFormRef";

const dataURLtoFile = (src: string, name: string) => {
    const arr = src.split(',');
    const mime = arr[0]!.match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    let u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], name, { type: mime });
}


const ItnQueryForm = React.forwardRef<IQueryFormRef, IQueryFormProps>((props, ref) => {
    const baseFormRef = useRef<IFormRef | null>(null);

    useImperativeHandle(ref, () => ({
        getCurrentValues() {
            return baseFormRef.current!.getCurrentValues();
        },
        validate() {
            return baseFormRef.current!.validate();
        }, 
        saveEntity(urlParams) {
            handleSave(baseFormRef.current!.getCurrentValues(), urlParams);
        },
        deleteEntity(urlParams) {
            handleDelete(baseFormRef.current!.getCurrentValues().id, urlParams)
        }
    }));

    const formType = useMemo(() => {
        if (props.type !== "auto") {
            return props.type;
        }

        if (props.id === null && props.entity === null) {
            return "create";
        } else {
            return "edit";
        }
    }, [props.entity, props.id, props.type]); 

    let fieldBuilder = props.fieldBuilder;

    const [entity, setEntity] = useState<LooseObject | null>(props.entity ?? null);
    const [isLoading, setIsLoading] = useState<boolean>(formType !== "create" && props.entity === null);
    const [errorLoading, setErrorLoading] = useState<string | null>(null); 
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const formWithFiles = useMemo(() => {
        return fieldBuilder.Build().some(_ => _.type === "file");
    }, [fieldBuilder]);

    useQuery<AxiosResponse<LooseObject>, AxiosError>(
        [props.apiUrl, props.id],
        getEntity(props.apiUrl ?? "/", props.id ?? ""),
        {
            enabled: formType !== "create" && props.entity == null,
            onError: (err) => {
                setErrorLoading(`Ошибка загрузки данных: ${err.message}`);
            },
            onSuccess: (response) => {
                let newEntity = response.data;
                for (let key in newEntity) {
                    if (newEntity[key] !== null && newEntity[key].name && newEntity[key].data) {
                        newEntity[key] = dataURLtoFile(newEntity[key].data, newEntity[key].name);
                    }
                }
                setEntity(newEntity);
                props.onAfterLoad && props.onAfterLoad(newEntity);
            },
            onSettled: () => {
                setIsLoading(false);
            }
        }
    );

    const dictQuieries = useQueries({
        queries: fieldBuilder.Build()
            .filter(_ => _.selectApiUrl !== null)
            .map(_ => ({
                queryKey: [_.selectApiUrl],
                queryFn: getDict,
                onSuccess: (response: AxiosResponse) => {
                    fieldBuilder = fieldBuilder.SetSelectOptions(_.property, response.data)
                }
            }))
    });

    useEffect(() => {
        dictQuieries.forEach(_ => _.refetch());
    }, [fieldBuilder]);

    const createQuery = useMutation(createEntity(props.apiUrl!), {
        onMutate: () => setIsSaving(true),
        onSuccess: (response) => props.onAfterSave && props.onAfterSave(response.data),
        onSettled: () => setIsSaving(false)
    });
    const updateQuery = useMutation(updateEntity(props.apiUrl!), {
        onMutate: () => setIsSaving(true),
        onSuccess: (response) => props.onAfterSave && props.onAfterSave(response.data),
        onSettled: () => setIsSaving(false)
    });
    const deleteQuery = useMutation(deleteEntity(props.apiUrl!), {
        onMutate: () => setIsSaving(true),
        onSuccess: (response) => props.onAfterDelete && props.onAfterDelete(response.data),
        onSettled: () => setIsSaving(false)
    });

    const handleSave = useCallback((newEntity: LooseObject, urlParams: LooseObject | null = null) => {
        let allParams: LooseObject | null = null;
        if (props.urlParams !== null) {
            allParams = { ...props.urlParams };
        }
        if (urlParams !== null) {
            allParams = { ...allParams, ...urlParams };
        }
        if (formType === "create") {
            createQuery.mutate({ entity: newEntity, useFormData: formWithFiles, urlParams: allParams });
        } else {
            updateQuery.mutate({ id: props.id, entity: newEntity, useFormData: formWithFiles, urlParams: allParams });
        }
    }, [createQuery, updateQuery, formType, formWithFiles, props.urlParams]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleDelete = useCallback((id: string, urlParams: LooseObject | null = null) => {
        let allParams: LooseObject | null = null;
        if (props.urlParams !== null) {
            allParams = { ...props.urlParams };
        }
        if (urlParams !== null) {
            allParams = { ...allParams, ...urlParams };
        }

        deleteQuery.mutate({ id: id, urlParams: allParams });
    }, [deleteQuery, props.urlParams]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <ItnBaseForm
            fieldBuilder={fieldBuilder}
            viewOnly={formType === "view"}
            cancelBtnText={props.cancelBtnText}
            deleteBtnText={props.deleteBtnText}
            entity={entity}
            errorLoading={errorLoading}
            header={props.header}
            hidePaper={props.hidePaper}
            isLoading={isLoading}
            isSaving={isSaving}
            noPadding={props.noPadding}
            onCancel={props.onCancel}
            onChange={props.onChange}
            onDelete={props.disableDelete ? undefined : handleDelete}
            onSave={props.disableSave ? undefined : handleSave}
            ref={baseFormRef}
            saveBtnText={props.saveBtnText}
            variant={props.variant}
        />
    );
});

ItnQueryForm.defaultProps = {
    onChange: null,
    noPadding: false,
    onAfterSave: null,
    onCancel: null,
    entity: null,
    id: null,
    type: "auto",
    hidePaper: false,
    header: null,
    variant: "outlined",
    disableSave: false,
    disableDelete: false,
    deleteBtnText: "Удалить",
    saveBtnText: "Сохранить",
    cancelBtnText: "Отмена",
    urlParams: null
}

export default ItnQueryForm;