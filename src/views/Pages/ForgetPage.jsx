import React from "react";
import PropTypes from "prop-types";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Clearfix from "components/Clearfix/Clearfix.jsx";
import NavPills from "components/NavPills/NavPills.jsx";
import Snackbars from "components/Snackbar/Snackbar.jsx";
// icons
import Gavel from "material-ui-icons/Gavel";
import Info from "material-ui-icons/Info";
import HelpOutline from "material-ui-icons/HelpOutline";

import registerPageStyle from "assets/jss/material-dashboard-pro-react/views/registerPageStyle";

import http from "libs/http";
import AddAlert from "material-ui-icons/AddAlert";

class ForgetPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tc: false,
            alertcolor: "success",
            alertmsg: "null",
            Password: "",
            PasswordState: "",
            ConfirmPassword: "",
            ConfirmPasswordState: "",
            Phone: "",
            PhoneState: "",
            Code: "",
            CodeState: "",

            email: "",
            emailState: "",
            EmailCode: "",
            EmailCodeState: "",
            EmailPassword: "",
            EmailPasswordState: "",
            EmailConfirmPassword: "",
            EmailConfirmPasswordState: "",

            help:"",
        };
    }

    showNotification(place) {
        if (!this.state[place]) {
            const x = [];
            x[place] = true;
            this.setState(x);
            // use this to make the notification autoclose
            setTimeout(
                function () {
                    x[place] = false;
                    this.setState(x);
                }.bind(this),
                6000
            );
        }
    }

    static verifyLength(value, length) {
        return value.length >= length;
    }

    static verifyCnMobile(value) {
        const numberRex = new RegExp(/^(0|\+?86)?(13[0-9]|14[57]|15[0-35-9]|17[0678]|18[0-9])[0-9]{8}$/);
        return numberRex.test(value);
    }

    static verifyMail(value) {
        const numberRex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        return numberRex.test(value);
    }

    static verifyCode(value) {
        const numberRex = new RegExp(/^[0-9]{6}$/);
        return numberRex.test(value);
    }

    change(event, stateName, type) {
        this.setState({
            [stateName]: event.target.value,
        });
        switch (type) {
            case "phone":
                if (ForgetPage.verifyCnMobile(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "mail":
                if (ForgetPage.verifyMail(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "code":
                if (ForgetPage.verifyCode(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "password":
                if (ForgetPage.verifyLength(event.target.value, 6)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            default:
                break;
        }
    }

    SendPhoneCode = () => {
        if (this.state.PhoneState === "success") {
            http.post("/api/v1/sms", {phone: this.state.Phone, "reg": true}).then(res => {
                // console.log(res);
                if (res.data.ok) {
                    this.setState({
                        alertcolor: "success",
                        alertmsg: "手机短信验证码已发到您手机，十五分钟内验证码有效，无需重复发送."
                    });
                    this.showNotification("tc")
                } else {
                    this.setState({
                        alertcolor: "danger",
                        alertmsg: res.data.errmsg
                    });
                    this.showNotification("tc")
                }
            }).catch(err => {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: "网络环境异常，系统无法正常访问服务器"
                });
                this.showNotification("tc")
            })
        }
    };

    UpdatePassword = () => {
        if (this.state.PhoneState !== "success") {
            this.setState({PhoneState: "error"});
            return
        }

        if (this.state.CodeState !== "success") {
            this.setState({CodeState: "error"});
            return
        }
        if (this.state.PasswordState !== "success") {
            this.setState({PasswordState: "error"});
            return
        }
        if (this.state.ConfirmPasswordState !== "success") {
            this.setState({ConfirmPasswordState: "error"});
            return
        }
        if (this.state.ConfirmPassword !== this.state.Password) {
            this.setState({PasswordState: "error"});
            this.setState({ConfirmPasswordState: "error"});
            return
        }
        http.post("/api/v1/pwd?code=" + this.state.Code, {
            kind: "phone",
            phone: this.state.Phone,
            npwd: this.state.Password,
        }).then(res => {
            if (res.data.ok) {
                this.props.history.push("/pages/login-page");
            } else {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc")
            }
        }).catch(err => {
            this.setState({
                alertcolor: "danger",
                alertmsg: "网络环境异常，系统无法正常访问服务器"
            });
            this.showNotification("tc")
        });
    };

    SendMailCode = () => {
        if (this.state.emailState === "success") {
            http.post("/api/v1/smail", {mail: this.state.email}).then(res => {
                // console.log(res);
                if (res.data.ok) {
                    this.setState({
                        alertcolor: "success",
                        alertmsg: "电子邮件验证码已发到您邮箱，十五分钟内验证码有效，无需重复发送."
                    });
                    this.showNotification("tc")
                } else {
                    this.setState({
                        alertcolor: "danger",
                        alertmsg: res.data.errmsg
                    });
                    this.showNotification("tc")
                }
            }).catch(err => {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: "网络环境异常，系统无法正常访问服务器"
                });
                this.showNotification("tc")
            })
        }
    };

    UpdateMailPassword = () => {
        if (this.state.emailState !== "success") {
            this.setState({ emailState: "error" });
            return
        }

        if (this.state.EmailCodeState !== "success") {
            this.setState({EmailCodeState: "error"});
            return
        }
        if (this.state.EmailPasswordState !== "success") {
            this.setState({EmailPasswordState: "error"});
            return
        }
        if (this.state.EmailConfirmPasswordState !== "success") {
            this.setState({EmailConfirmPasswordState: "error"});
            return
        }
        if (this.state.EmailConfirmPassword !== this.state.EmailPassword) {
            this.setState({EmailPasswordState: "error"});
            this.setState({EmailConfirmPasswordState: "error"});
            return
        }
        http.post("/api/v1/pwd?code=" + this.state.EmailCode, {
            kind: "mail",
            mail: this.state.email,
            npwd: this.state.EmailPassword,
        }).then(res => {
            if (res.data.ok) {
                this.props.history.push("/pages/login-page");
            } else {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc")
            }
        }).catch(err => {
            this.setState({
                alertcolor: "danger",
                alertmsg: "网络环境异常，系统无法正常访问服务器"
            });
            this.showNotification("tc")
        });
    };

    componentWillMount() {
        this.loadData()
    }

    loadData() {
        http.get("/api/v1/configs").then(res => {
            if (res.data.ok) {
                this.setState({
                    help: res.data.data[0].help,
                })
            } else {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc")
            }
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.container}>
                <GridContainer justify="center">
                    <ItemGrid xs={12} sm={12} md={8}>
                        <h3 className={classes.pageSubcategoriesTitle}>
                            找回账户密码
                        </h3>
                        <br/>
                        <NavPills
                            color="warning"
                            alignCenter
                            tabs={[
                                {
                                    tabButton: "手机验证码",
                                    tabIcon: Info,
                                    tabContent: (
                                        <RegularCard
                                            cardTitle="通过已注册账户手机接收验证码"
                                            cardSubtitle="输入验证码更新账户密码"
                                            content={
                                                <div>
                                                    <GridContainer>
                                                        <ItemGrid xs={12} sm={12} md={4}>
                                                            <CustomInput
                                                                success={this.state.PhoneState === "success"}
                                                                error={this.state.PhoneState === "error"}
                                                                labelText="已注册账户手机号码"
                                                                formControlProps={{
                                                                    fullWidth: true,
                                                                    onChange: event =>
                                                                        this.change(event, "Phone", "phone"),
                                                                }}
                                                            />
                                                        </ItemGrid>
                                                        <ItemGrid xs={12} sm={12} md={4}>
                                                            <CustomInput
                                                                success={this.state.CodeState === "success"}
                                                                error={this.state.CodeState === "error"}
                                                                labelText="手机短信验证码"
                                                                formControlProps={{
                                                                    fullWidth: true,
                                                                    onChange: event =>
                                                                        this.change(event, "Code", "code"),
                                                                }}
                                                            />
                                                        </ItemGrid>
                                                        <ItemGrid xs={12} sm={12} md={3}>
                                                            <Button round color="success" onClick={this.SendPhoneCode}
                                                                    right>
                                                                发送验证码
                                                            </Button>
                                                        </ItemGrid>
                                                    </GridContainer>
                                                    <GridContainer>
                                                        <ItemGrid xs={12} sm={12} md={4}>
                                                            <CustomInput
                                                                success={this.state.PasswordState === "success"}
                                                                error={this.state.PasswordState === "error"}
                                                                labelText="新密码"
                                                                formControlProps={{
                                                                    fullWidth: true,
                                                                    onChange: event =>
                                                                        this.change(event, "Password", "password"),
                                                                }}
                                                                inputProps={{
                                                                    type: "password"
                                                                }}
                                                            />
                                                        </ItemGrid>
                                                        <ItemGrid xs={12} sm={12} md={4}>
                                                            <CustomInput
                                                                success={this.state.ConfirmPasswordState === "success"}
                                                                error={this.state.ConfirmPasswordState === "error"}
                                                                labelText="确认新密码"
                                                                formControlProps={{
                                                                    fullWidth: true,
                                                                    onChange: event =>
                                                                        this.change(event, "ConfirmPassword", "password"),
                                                                }}
                                                                inputProps={{
                                                                    type: "password"
                                                                }}
                                                            />
                                                        </ItemGrid>
                                                        <ItemGrid xs={12} sm={12} md={3}>
                                                            <Button round color="primary"
                                                                    onClick={this.UpdatePassword}
                                                                    right>
                                                                生效新密码
                                                            </Button>
                                                        </ItemGrid>
                                                    </GridContainer>
                                                    <Clearfix/>
                                                </div>
                                            }
                                        />
                                    )
                                },
                                {
                                    tabButton: "电子邮箱验证码",
                                    tabIcon: Gavel,
                                    tabContent: (
                                        <RegularCard
                                            cardTitle="通过已注册账户绑定电子邮箱接收验证码"
                                            cardSubtitle="输入验证邮件中验证码更新账户密码"
                                            content={
                                                <div>
                                                    <GridContainer>
                                                        <ItemGrid xs={12} sm={12} md={4}>
                                                            <CustomInput
                                                                success={this.state.emailState === "success"}
                                                                error={this.state.emailState === "error"}
                                                                labelText="已注册账户电子邮箱"
                                                                formControlProps={{
                                                                    fullWidth: true,
                                                                    onChange: event =>
                                                                        this.change(event, "email", "mail"),
                                                                }}
                                                            />
                                                        </ItemGrid>
                                                        <ItemGrid xs={12} sm={12} md={4}>
                                                            <CustomInput
                                                                success={this.state.EmailCodeState === "success"}
                                                                error={this.state.EmailCodeState === "error"}
                                                                labelText="电子邮件验证码"
                                                                formControlProps={{
                                                                    fullWidth: true,
                                                                    onChange: event =>
                                                                        this.change(event, "EmailCode", "code"),
                                                                }}
                                                            />
                                                        </ItemGrid>
                                                        <ItemGrid xs={12} sm={12} md={3}>
                                                            <Button round color="success" onClick={this.SendMailCode}
                                                                    right>
                                                                发送验证码
                                                            </Button>
                                                        </ItemGrid>
                                                    </GridContainer>
                                                    <GridContainer>
                                                        <ItemGrid xs={12} sm={12} md={4}>
                                                            <CustomInput
                                                                success={this.state.EmailPasswordState === "success"}
                                                                error={this.state.EmailPasswordState === "error"}
                                                                labelText="新密码"
                                                                formControlProps={{
                                                                    fullWidth: true,
                                                                    onChange: event =>
                                                                        this.change(event, "EmailPassword", "password"),
                                                                }}
                                                                inputProps={{
                                                                    type: "password"
                                                                }}
                                                            />
                                                        </ItemGrid>
                                                        <ItemGrid xs={12} sm={12} md={4}>
                                                            <CustomInput
                                                                success={this.state.EmailConfirmPasswordState === "success"}
                                                                error={this.state.EmailConfirmPasswordState === "error"}
                                                                labelText="确认新密码"
                                                                formControlProps={{
                                                                    fullWidth: true,
                                                                    onChange: event =>
                                                                        this.change(event, "EmailConfirmPassword", "password"),
                                                                }}
                                                                inputProps={{
                                                                    type: "password"
                                                                }}
                                                            />
                                                        </ItemGrid>
                                                        <ItemGrid xs={12} sm={12} md={3}>
                                                            <Button round color="primary"
                                                                    onClick={this.UpdateMailPassword}
                                                                    right>
                                                                生效新密码
                                                            </Button>
                                                        </ItemGrid>
                                                    </GridContainer>
                                                    <Clearfix/>
                                                </div>
                                            }
                                        />
                                    )
                                },
                                {
                                    tabButton: "帮助中心",
                                    tabIcon: HelpOutline,
                                    tabContent: (
                                        <RegularCard
                                            cardTitle="如有疑问"
                                            cardSubtitle="请联系我们"
                                            content={
                                                this.state.help
                                            }
                                        />
                                    )
                                }
                            ]}
                        />
                    </ItemGrid>
                </GridContainer>
                <Snackbars
                    place="tc"
                    color={this.state.alertcolor}
                    icon={AddAlert}
                    message={this.state.alertmsg}
                    open={this.state.tc}
                    closeNotification={() => this.setState({tc: false})}
                    close
                />
            </div>
        );
    }
}

ForgetPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(registerPageStyle)(ForgetPage);
