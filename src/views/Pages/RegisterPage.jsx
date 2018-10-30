import React from "react";
import PropTypes from "prop-types";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
import InputAdornment from "material-ui/Input/InputAdornment";
import Checkbox from "material-ui/Checkbox";
import FormControlLabel from "material-ui/Form/FormControlLabel";
// material-ui-icons
// import Timeline from "material-ui-icons/Timeline";
// import Code from "material-ui-icons/Code";
// import Group from "material-ui-icons/Group";
import Face from "material-ui-icons/Face";
import PhonelinkLock from "material-ui-icons/PhonelinkLock";
import Sms from "material-ui-icons/Sms";
import LockOutline from "material-ui-icons/LockOutline";
import Check from "material-ui-icons/Check";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import RegularCard from "components/Cards/RegularCard.jsx";
import Button from "components/CustomButtons/Button.jsx";
// import IconButton from "components/CustomButtons/IconButton.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
// import InfoArea from "components/InfoArea/InfoArea.jsx";
//alert
// @material-ui/icons
import AddAlert from "material-ui-icons/AddAlert";
import Mail from "material-ui-icons/MailOutline";
// core components
import Snackbars from "components/Snackbar/Snackbar.jsx";

import registerPageStyle from "assets/jss/material-dashboard-pro-react/views/registerPageStyle";

import http from "libs/http";

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registerCheckbox: false,
            registerCheckboxState: "",
            tc: false,
            alertcolor: "success",
            alertmsg: "null",
            registerUid: "",
            registerUidState: "",
            registerPassword: "",
            registerPasswordState: "",
            registerConfirmPassword: "",
            registerConfirmPasswordState: "",
            registerPhone: "",
            registerPhoneState: "",
            registerCode: "",
            registerCodeState: "",
            registerMail: "",
            registerMailState: "",
            registerMailCode:"",
            registerMailCodeState:"",
            regpaper:"https://www.mi.com/about/new-privacy/",
        };
        this.handleToggle = this.handleToggle.bind(this);
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

    handleToggle(value) {
        const { checked } = this.state;
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        this.setState({
            checked: newChecked
        });
    }

    static verifyLength(value, length) {
        return value.length >= length;
    }

    static verifyCnMobile(value) {
        const numberRex = new RegExp(/^(0|\+?86)?(13[0-9]|14[57]|15[0-35-9]|17[0678]|18[0-9])[0-9]{8}$/);
        return numberRex.test(value);
    }

    static verifyCode(value) {
        const numberRex = new RegExp(/^[0-9]{6}$/);
        return numberRex.test(value);
    }

    static verifyMail(value) {
        const numberRex = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
        return numberRex.test(value);
    }

    change(event, stateName, type) {
        this.setState({
            [stateName]: event.target.value,
        });
        switch (type) {
            case "checkbox":
                this.setState({
                    [stateName]: event.target.checked
                });
                if (event.target.checked) {
                    this.setState({ [stateName + "State"]: "" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "name":
                if (RegisterPage.verifyLength(event.target.value, 3)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "phone":
                if (RegisterPage.verifyCnMobile(event.target.value)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "code":
                if (RegisterPage.verifyCode(event.target.value)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "password":
                if (RegisterPage.verifyLength(event.target.value, 6)) {
                    this.setState({ [stateName + "State"]: "success" });
                } else {
                    this.setState({ [stateName + "State"]: "error" });
                }
                break;
            case "mail":
                if (RegisterPage.verifyMail(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            default:
                break;
        }
    }

    sendCode = () => {
        if (this.state.registerPhoneState === "success") {
            http.post("/api/v1/sms", { phone: this.state.registerPhone }).then(res => {
                // console.log(res);
                if (res.data.ok) {
                    this.setState({
                        alertcolor: "success",
                        alertmsg: "手机短信验证码已发到您手机，十五分钟内验证码有效，无需重复发送."
                    });
                    this.showNotification("tc")
                } else {
                    this.setState({
                        alertcolor: "warning",
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
        } else {
            this.setState({ registerPhoneState: "error" });
        }
    };

    SendMailCode = () => {
        if (this.state.registerMailState === "success") {
            http.post("/api/v1/smail", {mail: this.state.registerMail}).then(res => {
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
        }else {
            this.setState({ registerMailState: "error" });
        }
    };

    regist = () => {
        if (this.state.registerUidState !== "success") {
            this.setState({ registerUidState: "error" });
            return
        }
        if (this.state.registerPasswordState !== "success") {
            this.setState({ registerPasswordState: "error" });
            return
        }
        if (this.state.registerConfirmPasswordState !== "success") {
            this.setState({ registerConfirmPasswordState: "error" });
            return
        }
        if (this.state.registerConfirmPassword !== this.state.registerPassword) {
            this.setState({ registerPasswordState: "error" });
            this.setState({ registerConfirmPasswordState: "error" });
            return
        }
        if (this.state.registerPhoneState !== "success") {
            this.setState({ registerPhoneState: "error" });
            return
        }
        if (this.state.registerCodeState !== "success") {
            this.setState({ registerCodeState: "error" });
            return
        }
        if (this.state.registerMailState !== "success") {
            this.setState({ registerMailState: "error" });
            return
        }
        if (this.state.registerMailCodeState !== "success") {
            this.setState({ registerMailCodeState: "error" });
            return
        }
        if (this.state.registerCheckboxState !== "success" && this.state.registerCheckbox !== true) {
            this.setState({ registerCheckboxState: "error" });
            this.setState({
                alertcolor: "danger",
                alertmsg: "请仔细阅读用户协议并同意再提交注册"
            });
            this.showNotification("tc");
            return
        }
        http.post("/api/v1/reg?code=" + this.state.registerCode, {
            uid: this.state.registerUid,
            pwd: this.state.registerPassword,
            phone: this.state.registerPhone,
            phonecode: this.state.registerCode,
            mail: this.state.registerMail,
            mailcode: this.state.registerMailCode,
        }).then(res => {
            if (res.data.ok) {
                this.props.history.push("/pages/login-page");
            } else {
                this.setState({
                    alertcolor: "warning",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc")
            }
        }).catch(err => {
            // console.log(err);
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
                    regpaper: res.data.data[0].regpaper,
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
        const { classes } = this.props;
        return (
            <div className={classes.container}>
                <GridContainer justify="center">
                    <ItemGrid xs={12} sm={12} md={10}>
                        <RegularCard
                            cardTitle="账户注册"
                            titleAlign="center"
                            customCardTitleClasses={classes.cardTitle}
                            customCardClasses={classes.cardClasses}
                            content={
                                <GridContainer justify="center">
                                    {/*<ItemGrid xs={12} sm={12} md={5}>*/}
                                        {/*<InfoArea*/}
                                            {/*title="独立OAuth2用户应用中心"*/}
                                            {/*description="本系统可独立部署构建用户账户系统."*/}
                                            {/*icon={Timeline}*/}
                                            {/*iconColor="rose"*/}
                                        {/*/>*/}
                                        {/*<InfoArea*/}
                                            {/*title="面向所有行业用户中心方案"*/}
                                            {/*description="社区网络、物络网平台、电子商城等等."*/}
                                            {/*icon={Code}*/}
                                            {/*iconColor="primary"*/}
                                        {/*/>*/}
                                        {/*<InfoArea*/}
                                            {/*title="全功能SAAS运行"*/}
                                            {/*description="系统即服务，全系统基于HTTP."*/}
                                            {/*icon={Group}*/}
                                            {/*iconColor="info"*/}
                                        {/*/>*/}
                                    {/*</ItemGrid>*/}
                                    <ItemGrid xs={12} sm={8} md={5}>
                                        {/*<div className={classes.center}>*/}
                                        {/*<IconButton color="twitter">*/}
                                        {/*<i className="fab fa-twitter"/>*/}
                                        {/*</IconButton>*/}
                                        {/*{` `}*/}
                                        {/*<IconButton color="dribbble">*/}
                                        {/*<i className="fab fa-dribbble"/>*/}
                                        {/*</IconButton>*/}
                                        {/*{` `}*/}
                                        {/*<IconButton color="facebook">*/}
                                        {/*<i className="fab fa-facebook-f"/>*/}
                                        {/*</IconButton>*/}
                                        {/*{` `}*/}
                                        {/*/!*<h4 className={classes.socialTitle}>or be classical</h4>*!/*/}
                                        {/*</div>*/}
                                        <form className={classes.form}>
                                            <CustomInput
                                                success={this.state.registerUidState === "success"}
                                                error={this.state.registerUidState === "error"}
                                                formControlProps={{
                                                    fullWidth: true,
                                                    className: classes.customFormControlClasses,
                                                    onChange: event =>
                                                        this.change(event, "registerUid", "name"),
                                                }}
                                                inputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start"
                                                            className={classes.inputAdornment}
                                                        >
                                                            <Face className={classes.inputAdornmentIcon} />
                                                        </InputAdornment>
                                                    ),
                                                    placeholder: "用户名..."
                                                }}
                                            />
                                            <CustomInput
                                                success={this.state.registerPasswordState === "success"}
                                                error={this.state.registerPasswordState === "error"}
                                                formControlProps={{
                                                    fullWidth: true,
                                                    className: classes.customFormControlClasses,
                                                    onChange: event =>
                                                        this.change(event, "registerPassword", "password"),
                                                }}
                                                inputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start"
                                                            className={classes.inputAdornment}
                                                        >
                                                            <LockOutline
                                                                className={classes.inputAdornmentIcon}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                    placeholder: "密码...",
                                                    type: "password"
                                                }}
                                            />
                                            <CustomInput
                                                success={this.state.registerConfirmPasswordState === "success"}
                                                error={this.state.registerConfirmPasswordState === "error"}
                                                formControlProps={{
                                                    fullWidth: true,
                                                    className: classes.customFormControlClasses,
                                                    onChange: event =>
                                                        this.change(event, "registerConfirmPassword", "password"),
                                                }}
                                                inputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start"
                                                            className={classes.inputAdornment}
                                                        >
                                                            <LockOutline
                                                                className={classes.inputAdornmentIcon}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                    placeholder: "重复输入密码...",
                                                    type: "password"
                                                }}
                                            />
                                            <CustomInput
                                                        success={this.state.registerPhoneState === "success"}
                                                        error={this.state.registerPhoneState === "error"}
                                                        formControlProps={{
                                                            fullWidth: true,
                                                            className: classes.customFormControlClasses,
                                                            onChange: event =>
                                                                this.change(event, "registerPhone", "phone"),
                                                        }}
                                                        inputProps={{
                                                            startAdornment: (
                                                                <InputAdornment
                                                                    position="start"
                                                                    className={classes.inputAdornment}
                                                                >
                                                                    <PhonelinkLock className={classes.inputAdornmentIcon} />
                                                                </InputAdornment>
                                                            ),
                                                            placeholder: "手机号码..."
                                                        }}
                                                    />
                                            <div className={classes.msgbox}>
                                                <div className={classes.msginput}>
                                                <CustomInput
                                                success={this.state.registerCodeState === "success"}
                                                error={this.state.registerCodeState === "error"}
                                                formControlProps={{
                                                    fullWidth: true,
                                                    className: classes.customFormControlClasses,
                                                    onChange: event =>
                                                        this.change(event, "registerCode", "code"),
                                                }}
                                                inputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start"
                                                            className={classes.inputAdornment}
                                                        >
                                                            <Sms className={classes.inputAdornmentIcon} />
                                                        </InputAdornment>
                                                    ),
                                                    placeholder: "手机验证码..."
                                                }}
                                            />
                                                </div>
                                                <div  className={classes.msgSendBt}>
                                                    <Button color="success" onClick={this.sendCode}>
                                                        发送手机验证码
                                                    </Button>
                                                </div>
                                            </div>

                                            <CustomInput
                                                success={this.state.registerMailState === "success"}
                                                error={this.state.registerMailState === "error"}
                                                formControlProps={{
                                                    fullWidth: true,
                                                    className: classes.customFormControlClasses,
                                                    onChange: event =>
                                                        this.change(event, "registerMail", "mail"),
                                                }}
                                                inputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            position="start"
                                                            className={classes.inputAdornment}
                                                        >
                                                            <Mail className={classes.inputAdornmentIcon} />
                                                        </InputAdornment>
                                                    ),
                                                    placeholder: "电子邮箱..."
                                                }}
                                            />
                                            <div className={classes.msgbox}>
                                                <div className={classes.msginput}>
                                                    <CustomInput
                                                        success={this.state.registerMailCodeState === "success"}
                                                        error={this.state.registerMailCodeState === "error"}
                                                        formControlProps={{
                                                            fullWidth: true,
                                                            className: classes.customFormControlClasses,
                                                            onChange: event =>
                                                                this.change(event, "registerMailCode", "code"),
                                                        }}
                                                        inputProps={{
                                                            startAdornment: (
                                                                <InputAdornment
                                                                    position="start"
                                                                    className={classes.inputAdornment}
                                                                >
                                                                    <Sms className={classes.inputAdornmentIcon} />
                                                                </InputAdornment>
                                                            ),
                                                            placeholder: "邮箱验证码..."
                                                        }}
                                                    />
                                                </div>
                                                <div  className={classes.msgSendBt}>
                                                    <Button color="success" onClick={this.SendMailCode}>
                                                        发送邮箱验证码
                                                    </Button>
                                                </div>
                                            </div>
                                        
                                            <FormControlLabel
                                                classes={{
                                                    root: classes.checkboxLabelControl,
                                                    label:
                                                        classes.label +
                                                        (this.state.registerCheckboxState === "error"
                                                            ? " " + classes.labelError
                                                            : "")
                                                }}
                                                control={
                                                    <Checkbox
                                                        tabIndex={-1}
                                                        onClick={event =>
                                                            this.change(event, "registerCheckbox", "checkbox")
                                                        }
                                                        checkedIcon={
                                                            <Check className={classes.checkedIcon} />
                                                        }
                                                        icon={<Check className={classes.uncheckedIcon} />}
                                                        classes={{
                                                            checked: classes.checked
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <span>
                                                        免责协议{" "}
                                                        <a href={this.state.regpaper} target="_blank">用户协议...</a>.
                                                    </span>
                                                }
                                            />
                                            <div className={classes.center}>
                                                <Button round color="primary" onClick={this.regist}>
                                                    提交注册
                                                </Button>
                                            </div>
                                        </form>
                                    </ItemGrid>
                                </GridContainer>
                            }
                        />
                    </ItemGrid>
                </GridContainer>
                <Snackbars
                    place="tc"
                    color={this.state.alertcolor}
                    icon={AddAlert}
                    message={this.state.alertmsg}
                    open={this.state.tc}
                    closeNotification={() => this.setState({ tc: false })}
                    close
                />
            </div>
        );
    }
}

RegisterPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(registerPageStyle)(RegisterPage);
