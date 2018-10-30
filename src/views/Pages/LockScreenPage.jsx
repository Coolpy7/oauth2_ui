import React from "react";
import PropTypes from "prop-types";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
import base from "assets/css/base.css";
// import avatar from "assets/img/faces/avatar.jpg";
import http from "libs/http";

import lockScreenPageStyle from "assets/jss/material-dashboard-pro-react/views/lockScreenPageStyle.jsx";
import AddAlert from "material-ui-icons/AddAlert";
import Snackbars from "components/Snackbar/Snackbar.jsx";
import Contacts from "material-ui-icons/Contacts";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";

class LockScreenPage extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            tc: false,
            alertcolor: "success",
            alertmsg: "null",
            showLogin: true,

            code: "",
            avatar: "",
            name: "您正在使用本平台帐号访问应用开放平台",
            uinfo: {},
            username: "",
            usernameState: "",
            password: "",
            passwordState: "",

            authicon: "",
            authpaper: "",
            authwaring: "",
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

    // function that verifies if a string has a given length or not
    static verifyLength(value, length) {
        return value.length >= length;

    }

    change(event, stateName, type) {
        this.setState({
            [stateName]: event.target.value,
        });
        switch (type) {
            case "username":
                if (LockScreenPage.verifyLength(event.target.value, 3)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "password":
                if (LockScreenPage.verifyLength(event.target.value, 6)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            default:
                break;
        }
    }

    componentDidMount() {
        let urlParams = new URLSearchParams(this.props.location.search);
        let appid = urlParams.get('client_id');
        if (appid !== null) {
            http.get('/api/v1/pub/app/' + appid).then(res => {
                if (res.data.ok) {
                    this.setState({
                        name: "《" + res.data.data[0].name + "》",
                        avatar: res.data.data[0].avatar
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
        http.get("/api/v1/configs").then(res => {
            if (res.data.ok) {
                this.setState({
                    authicon: res.data.data[0].authicon,
                    authpaper: res.data.data[0].authpaper,
                    authwaring: res.data.data[0].authwaring,
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

    cancelauth = () => {
        this.setState({
            showLogin: true,
            code: "",
            usernameState: "error",
            passwordState: "error"
        })
    }

    handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            this.loginClick()
        }
    };

    loginClick = () => {
        if (this.state.usernameState !== "success") {
            this.setState({usernameState: "error"});
            return
        }

        if (this.state.passwordState !== "success") {
            this.setState({passwordState: "error"});
            return
        }
        http.post('/oauth2/login', {"uid": this.state.username, "pwd": this.state.password}).then(res => {
            if (res.data.ok === true) {
                this.setState({
                    username: "",
                    password: "",
                    code: res.data.data[0].codetoken,
                    uinfo: res.data.data[0],
                    showLogin: false
                })
            } else {
                this.setState({
                    username: "",
                    password: "",
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc")
            }
        })
    }

    grantClick = () => {
        let urlParams = new URLSearchParams(this.props.location.search);
        window.location.href = global.constants.website + '/oauth2/grant?' + urlParams.toString() + "&codetoken=" + this.state.code;
    }

    render() {
        const {classes} = this.props;
        return (
            <div style={{
                paddingTop: "18vh",
                minHeight: "110vh",
                position: "relative",
                zIndex: "4"
            }}>
                <div className="loginInfo">
                    <ItemGrid xs={12} sm={12} md={12}>
                        <div className="topBox">
                            <h2>{this.state.name}</h2>
                            <div className="logoBox">
                                <div className="leftRound">
                                    <img src={this.state.avatar} alt="..."/>
                                </div>
                                <div className="centerArrow">
                                    <p>提供授权信息</p>
                                    <div className="leftArrow"><span className="left"/></div>
                                    <div className="rightArrow"><span className="right"/></div>
                                    <p>提供增值服务</p>
                                </div>
                                <div className="rightRound">
                                    <img
                                        src={this.state.authicon === "" ? require('../../assets/img/faces/avatar.png') : this.state.authicon}
                                        alt="..."/>
                                </div>
                            </div>
                            <h3>登录并授权后应用本开放平台 可访问您的个人信息，并为您提供更加优质的服务！</h3>
                            <a href={this.state.authpaper === "" ? "https://www.mi.com/about/new-privacy/" : this.state.authpaper}
                               target="_blank">查看服务协议</a>
                        </div>
                    </ItemGrid>
                    {this.state.showLogin ?
                        <ItemGrid xs={12} sm={12} md={12}>
                            <IconCard
                                icon={Contacts}
                                iconColor="rose"
                                title="授权登录"
                                content={
                                    <form>
                                        <CustomInput
                                            success={this.state.usernameState === "success"}
                                            error={this.state.usernameState === "error"}
                                            labelText="用户名 *"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event =>
                                                    this.change(event, "username", "username"),
                                                type: "text",
                                                value: this.state.username
                                            }}
                                        />
                                        <CustomInput
                                            success={this.state.passwordState === "success"}
                                            error={this.state.passwordState === "error"}
                                            labelText="密码 *"
                                            formControlProps={{
                                                fullWidth: true
                                            }}
                                            inputProps={{
                                                onChange: event =>
                                                    this.change(event, "password", "password"),
                                                type: "password",
                                                value: this.state.password,
                                                onKeyPress: event =>
                                                    this.handleKeyPress(event),
                                            }}
                                        />
                                        <div className={classes.center}>
                                            <Button color="rose" onClick={this.loginClick}>
                                                登录
                                            </Button>
                                        </div>
                                    </form>
                                }
                            />
                        </ItemGrid> :
                        <ItemGrid xs={12} sm={12} md={12}>
                            <IconCard
                                icon={Contacts}
                                iconColor="rose"
                                title="应用授权信息"
                                content={
                                    <div>
                                        <div className="picture-container">
                                            <div className="picture">
                                                <img
                                                    src={this.state.uinfo.avatar}
                                                    className="picture-src"
                                                    alt="..."
                                                />
                                            </div>
                                            <h6 className="description">{this.state.uinfo.username}</h6>
                                        </div>
                                        <p>您将授权应用本开放平台一下权限</p>
                                        <ul>
                                            <li>获取您的帐号信息：{this.state.uinfo.userid}</li>
                                            <li>获取您的手机号码信息：{this.state.uinfo.phone}</li>
                                            <li>获取您的电子邮箱信息：{this.state.uinfo.mail}</li>
                                        </ul>
                                        <p>授权成功后，您可以在授权管理里查看和取消授权。</p>
                                    </div>
                                }
                                footer={
                                    <div className={classes.center}>
                                        <div align="right">
                                            <Button color="rose" onClick={this.cancelauth}>
                                                更换账号
                                            </Button>
                                            <Button color="success" onClick={this.grantClick}>
                                                立即授权
                                            </Button>
                                        </div>
                                    </div>
                                }
                            />
                        </ItemGrid>
                    }
                    <div className="bottomBox">
                        <i/><span>提示：{this.state.authwaring === "" ? "为保障帐号安全，请认准URL地址必须以***.COOLPY.NET开头" : this.state.authwaring}</span>
                    </div>
                </div>
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

LockScreenPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(lockScreenPageStyle, base)(LockScreenPage);
