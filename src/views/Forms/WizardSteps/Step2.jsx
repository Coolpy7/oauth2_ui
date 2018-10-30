import React from "react";

import RecordVoiceOver from "material-ui-icons/RecordVoiceOver";
import Email from "material-ui-icons/Email";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
import InputAdornment from "material-ui/Input/InputAdornment";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import AddAlert from "material-ui-icons/AddAlert";
import Snackbars from "components/Snackbar/Snackbar.jsx";

import http from "libs/http";

const style = {
    infoText: {
        fontWeight: "300",
        margin: "10px 0 30px",
        textAlign: "center"
    },
    inputAdornmentIcon: {
        color: "#555"
    },
    inputAdornment: {
        top: "3px",
        position: "relative",
    },
    msgbox: {
        display: "flex"
    },
    msginput: {
        flex: "1",
    },
    msgSendBt: {
        display: "inline-block",
        marginLeft: "15px"
    },
    footer: {
        padding: "30px 0px 0px 0px"
    },
    left: {
        float: "left!important"
    },
    right: {
        float: "right!important"
    },
    clearfix: {
        "&:after,&:before": {
            display: "table",
            content: '" "'
        },
        clear: "both"
    }
};

class Step2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tc: false,
            alertcolor: "success",
            alertmsg: "null",
            code: "",
            codeState: "",
            ncode: "",
            ncodeState: "",
            nphone: "",
            nphoneState: "",
            ophone: ""
        };
    }

    componentDidMount(){
        let uif = sessionStorage.getItem("userinfo");
        if (uif == null) {
            this.setState({
                alertcolor: "danger",
                alertmsg: "取当前用户信息异常,请重新登陆后继续操作。"
            });
            this.showNotification("tc");
            return
        }
        let uinfo = JSON.parse(uif);
        this.setState({
            ophone: uinfo.phone
        })
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
                if (Step2.verifyCnMobile(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "mail":
                if (Step2.verifyMail(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "code":
                if (Step2.verifyCode(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "nick":
                if (Step2.verifyLength(event.target.value, 2)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            default:
                break;
        }
    }

    SendOPhoneCode = () => {
        if (this.state.ophone !== "") {
            http.post("/api/v1/sms", {phone: this.state.ophone, "reg": true}).then(res => {
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

    SendNPhoneCode = () => {
        if (this.state.nphoneState === "success") {
            http.post("/api/v1/sms", {phone: this.state.nphone}).then(res => {
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

    UpdatePhone = () => {
        if (this.state.nphoneState !== "success") {
            this.setState({nphoneState: "error"});
            return
        }

        if (this.state.codeState !== "success") {
            this.setState({codeState: "error"});
            return
        }

        if (this.state.ncodeState !== "success") {
            this.setState({ncodeState: "error"});
            return
        }

        http.post("/api/v1/phone?code=" + this.state.code + "&ncode=" + this.state.ncode, {
            phone: this.state.ophone,
            nphone: this.state.nphone,
        }).then(res => {
            if (res.data.ok) {
                this.setState({
                    alertcolor: "success",
                    alertmsg: "操作成功",
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
            console.log(err);
            this.setState({
                alertcolor: "danger",
                alertmsg: "网络环境异常，系统无法正常访问服务器"
            });
            this.showNotification("tc")
        });
    };

    render() {
        const {classes} = this.props;
        return (
            <div>
                <GridContainer justify="center">
                    <ItemGrid xs={12} sm={12} md={12}>
                        <h4 className={classes.infoText}>
                            修改你的手机号
                        </h4>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={12} md={12}>
                        <div className={classes.msgbox}>
                            <div className={classes.msginput}>
                                <CustomInput
                                    success={this.state.codeState === "success"}
                                    error={this.state.codeState === "error"}
                                    labelText={
                                        <span>
                                        原手机验证码<small>(必填)</small>
                                    </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <Email position="end" className={classes.inputAdornment}>
                                                <RecordVoiceOver className={classes.inputAdornmentIcon}/>
                                            </Email>
                                        ),
                                        onChange: event =>
                                            this.change(event, "code", "code"),
                                    }}

                                />
                            </div>
                            <div className={classes.msgSendBt}>
                                <Button color="success" onClick={this.SendOPhoneCode}>发送验证码</Button>
                            </div>
                        </div>
                        <CustomInput
                            success={this.state.nphoneState === "success"}
                            error={this.state.nphoneState === "error"}
                            labelText={
                                <span>
                                新手机号 <small>(必填)</small>
                            </span>
                            }
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className={classes.inputAdornment}>
                                        <RecordVoiceOver className={classes.inputAdornmentIcon}/>
                                    </InputAdornment>
                                ),
                                onChange: event =>
                                    this.change(event, "nphone", "phone"),
                            }}
                        />
                        <div className={classes.msgbox}>
                            <div className={classes.msginput}>
                                <CustomInput
                                    success={this.state.ncodeState === "success"}
                                    error={this.state.ncodeState === "error"}
                                    labelText={
                                        <span>
                                        新手机验证码<small>(必填)</small>
                                    </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <Email position="end" className={classes.inputAdornment}>
                                                <RecordVoiceOver className={classes.inputAdornmentIcon}/>
                                            </Email>
                                        ),
                                        onChange: event =>
                                            this.change(event, "ncode", "code"),
                                    }}

                                />
                            </div>
                            <div className={classes.msgSendBt}>
                                <Button color="success" onClick={this.SendNPhoneCode}>发送验证码</Button>
                            </div>
                        </div>
                        <div className={classes.footer}>
                            <div className={classes.right}>
                                <Button color="rose" onClick={this.UpdatePhone}>
                                    修 改
                                </Button>
                            </div>
                            <div className={classes.clearfix}/>
                        </div>
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

export default withStyles(style)(Step2);
