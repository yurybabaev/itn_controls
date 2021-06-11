import React, { Component } from "react";
import {
    Typography,
    Box,
} from "@material-ui/core";
import common from "../common/styles";
import colors from "../common/colors";
import CustomForm from "../components/CustomForm";
import { ToRuDate } from "../utils/utils";
import { withStyles } from "@material-ui/core/styles";

const initialUser = {
    name: "",
    surname: "",
    middleName: "Петрович",
    email: "",
    personHash: "",
    password: "",
    blocked: false,
    phoneNumber: "",
    userName: "",
    createdDate: new Date().toISOString()
}

class TestComnonent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entity: null,
            user: initialUser,
            role: "group 1",
            roles: [{ name: 'group 1', ruName: 'группа 1' }, { name: 'group 2', ruName: 'группа 2' }, { name: 'group 3', ruName: 'группа 3'}],
            blockOpen: false,
            smbAvailabilityPeriod: null
        };
    }

    _setField = (name, value, callback) => {
        let userName = name === "userName" ? value : this.state.user.userName;

        let role = name === "role" ? value : this.state.role;
        this.setState({
            role,
            highlightErrors: false,
            blocking: true
        });

        if (["name", "surname", "middleName"].includes(name)) {
            value = value.replace(/\d/g, '');
        }

        if (["name", "surname", "middleName"].includes(name)) {
            userName = "int-";

            let surname = name === "surname" ? value : this.state.user.surname;
            if (surname.length > 0) {
                surname = surname[0].toLowerCase();
            } else {
                surname = ""
            }
            userName += surname

            let fname = name === "name" ? value : this.state.user.name;
            if (fname.length > 0) {
                fname = fname[0].toLowerCase();
            } else {
                fname = ""
            }
            userName += fname;

            let middleName = name === "middleName" ? value : this.state.user.middleName;
            if (middleName.length > 0) {
                middleName = middleName[0].toLowerCase();
            } else {
                middleName = ""
            }
            userName += middleName;
        }

        let user = {
            ...this.state.user,
            [name]: value,
            userName: userName
        };

        this.setState({
            user,
            highlightErrors: false,
            blocking: true
        }, () => callback && callback())

        if (!this.state.user.name) {

            let sendMail = name === "sendMail" ? value : this.state.sendMail;
            this.setState({
                sendMail
            });
        }
    }

    render() {
        let { classes } = this.props;
        return <div>
            <Box display="flex" alignItems="center">
                <Typography variant="h6">
                    Create new entity
                </Typography>
            </Box>
            <CustomForm
                setField={this._setField}
                entity={this.state.entity}
                classes={classes}
                header="New entity"
                highlightErrors={false}
                formStyles={{ paddingLeft: '16px' }}
                controls={[
                    {
                        label: 'Select control',
                        req: true,
                        type: 'select',
                        value: this.state.role,
                        name: 'role',
                        options: {
                            items: this.state.roles.map(r => ({
                                label: r.name,
                                value: r.ruName
                            }))
                        },
                        isShown: true,
                        onChange: event => this.setState({ role: event.target.value, check: false, blocking: true })
                    },
                    {
                        label: 'Text control',
                        req: true,
                        type: 'text',
                        value: this.state.user.surname,
                        name: "surname",
                        isShown: true
                    },
                    {
                        label: 'Chip-input control',
                        type: 'chip-input',
                        value: this.state.user.middleName ? this.state.user.middleName.split(",") : [],
                        name: "middleName",
                        isShown: true
                    },
                    {
                        label: 'Password control',
                        req: true,
                        type: 'password',
                        value: this.state.user.password,
                        name: "password",
                        tooltip: 'Может быть сформирован системой автоматически (по нажатию на кнопку генерации пароля правее) либо задан по усмотрению администратора с учетом следующих требований: не менее 9 символов, наличие не менее 1 цифры, наличие не менее 1 символа высокого регистра, наличие не менее 1 символа низкого регистра, наличие не менее 1 специального символа',
                        isShown: true
                    },
                    {
                        label: 'Text control',
                        type: 'text',
                        value: this.state.user.phoneNumber,
                        name: "phoneNumber",
                        placeholder: '+7 (123) 456 78 90',
                        isShown: true
                    },
                    {
                        label: 'Text control',
                        type: 'text',
                        value: ToRuDate(this.state.user.createdDate, true),
                        disabled: true,
                        isShown: true
                    },
                    {
                        label: 'Date control',
                        type: 'date',
                        value: this.state.user.dateOfNotification,
                        placeholder: new Date().toLocaleDateString("ru-RU"),
                        options: {
                            minDate: new Date('1917-01-01'),
                            maxDate: new Date('2077-01-01')
                        },
                        isShown: true,
                        name: 'dateOfNotification'
                    },
                    {
                        label: 'Bool control',
                        type: 'bool',
                        value: this.state.sendMail,
                        name: "sendMail",
                        isShown: true
                    },
                    {
                        label: 'Number control',
                        type: 'number',
                        value: this.state.user.availabilityPeriod,
                        name: "availabilityPeriod",
                        placeholder: 10,
                        inputProps: {min: 0, max: 99},
                        isShown: true
                    },
                    {
                        label: 'Button control',
                        type: 'button',
                        value: 'Отправить тест',
                        name: 'sendButton',
                        isShown: true
                    }
                ]}
            />
        </div>;
    }
}

const styles = theme => ({
    ...common(theme),
    ...colors(theme),
    flex: {
        display: "flex",
        alignItems: "center",
        marginTop: 10
    },
    option: {
        fontSize: 15
    }
});

export default withStyles(styles)(TestComnonent);