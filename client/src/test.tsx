import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { AbstractFieldBuilder, ItnForm, ItnSelectOption, PageTitle } from "controls/src";
//import { AbstractFieldBuilder, ItnForm, ItnSelectOption, PageTitle } from "@itneris/controls";

interface IUserDTO {
    id: string;
    name: string;
    surname: string;
    role: string;
    blocked: boolean;
    middlename: string;
    password: string;
    avatar: string
}

class UsersFieldBuilder extends AbstractFieldBuilder<IUserDTO> {
    constructor() {
        super();
        this.FieldFor(_ => _.avatar)
            .WithLabel("Аватар")
            .File({ withImagePreview: true });

        this.FieldFor(_ => _.name)
            .WithLabel("Имя")
            .Required();

        this.FieldFor(_ => _.surname)
            .WithLabel("Фамилия")
            .Disable();

        this.FieldFor(_ => _.password)
            .WithLabel("Пароль")
            .Password()
            .WithValidation((val) => {
                const value = val as string;
                if (value.length < 3) {
                    return "Пароль должен быть длиннее трех символов";
                }
                return null;
            });

        this.FieldFor(_ => _.blocked)
            .WithLabel("Заблокирован")
            .Bool();

        this.FieldFor(_ => _.role)
            .WithLabel("Роль")
            .Select([
                new ItnSelectOption("1", "Админ"),
                new ItnSelectOption("2", "Пользователь"),
                new ItnSelectOption("3", "Дата-менеджер"),
            ]);


        this.FieldFor(_ => _.middlename)
            .WithCustomControl((val, onChange) => {
                return <div style={{ cursor: "pointer" }} onClick={() => onChange((val ?? "") + "1")}>
                    {val ?? "Нет значения"}
                </div>
            });
    }
}

const fieldBuilder = new UsersFieldBuilder();

const TestComnonent = () => {
    const queryClient = useQueryClient();
    return (
        <>
            <PageTitle>Тестовая форма создания</PageTitle>
            <ItnForm
                apiUrl="http://localhost:5000/api/test"
                queryClient={queryClient}
                fieldBuilder={fieldBuilder}
            />
            <PageTitle>Тестовая форма редактирования</PageTitle>
            <ItnForm
                apiUrl="http://localhost:5000/api/test"
                queryClient={queryClient}
                fieldBuilder={fieldBuilder}
                id="1"
            />
            <PageTitle>Тестовая форма без апи</PageTitle>
            <ItnForm
                entity={{
                    id: "2",
                    name: "Name",
                    surname: "Surname",
                    role: "1",
                    blocked: true,
                    middlename: "middlename",
                    password: "password",
                } as IUserDTO}
                queryClient={queryClient}
                fieldBuilder={fieldBuilder}
            />
        </>
    );
}

export default TestComnonent;