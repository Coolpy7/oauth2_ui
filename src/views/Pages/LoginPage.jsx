import React from "react";
import PropTypes from "prop-types";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
import InputAdornment from "material-ui/Input/InputAdornment";
// material-ui-icons
import Face from "material-ui-icons/Face";
import LockOutline from "material-ui-icons/LockOutline";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import LoginCard from "components/Cards/LoginCard.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import Button from "components/CustomButtons/Button.jsx";
import Snackbars from "components/Snackbar/Snackbar.jsx";
import AddAlert from "material-ui-icons/AddAlert";


import loginPageStyle from "assets/jss/material-dashboard-pro-react/views/loginPageStyle.jsx";

import http from "libs/http"
// import Warning from "material-ui-icons/Warning";

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        // we use this to make the card to appear after the page has been rendered
        this.state = {
            cardAnimaton: "cardHidden",
            loginUid: "",
            loginPassword: "",
            tc: false,
            alertcolor: "success",
            alertmsg: "null",
        };
    }

    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        setTimeout(
            function () {
                this.setState({cardAnimaton: ""});
            }.bind(this),
            50
        );
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

    handelInput = name => event => {
        this.setState({
            [name]: event.target.value,
        });
    };

    handleKeyPress = (event) => {
        if(event.key === 'Enter'){
            this.gologin()
        }
    };

    gologin = () => {
        let kind = "uid";
        if (LoginPage.verifyLength(this.state.loginUid, 3) !== true) {
            this.setState({
                alertcolor: "danger",
                alertmsg: "用户名输入验证失败"
            });
            this.showNotification("tc");
            return
        }
        if (LoginPage.verifyCnMobile(this.state.loginUid) === true) {
            kind = "phone";
        }
        if (LoginPage.verifyLength(this.state.loginPassword, 6) !== true) {
            this.setState({
                alertcolor: "danger",
                alertmsg: "密码输入验证失败"
            });
            this.showNotification("tc");
            return
        }

        http.post("/api/v1/token", {
            kind: kind,
            uid: this.state.loginUid,
            pwd: this.state.loginPassword,
        }).then(res => {
            if (res.data.ok === true) {
                sessionStorage.setItem("token", res.data.data[0].token);
                sessionStorage.setItem("refresh_token", res.data.data[0].refresh_token);
                http.get("/api/v1/profile").then(res1 => {
                    if (res1.data.ok === true) {
                        sessionStorage.setItem("userinfo", JSON.stringify(res1.data.data[0]));
                        this.props.history.push("/")
                    } else {
                        this.setState({
                            alertcolor: "danger",
                            alertmsg: res.data.errmsg
                        });
                        this.showNotification("tc");
                    }
                }).catch(err => {
                    this.setState({
                        alertcolor: "danger",
                        alertmsg: "网络环境异常，系统无法正常访问服务器"
                    });
                    this.showNotification("tc")
                })
            } else {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc");
            }
        }).catch(err => {
            this.setState({
                alertcolor: "danger",
                alertmsg: "网络环境异常，系统无法正常访问服务器"
            });
            this.showNotification("tc")
        })
    };

    render() {
        const {classes} = this.props;
        return (
            <div className={classes.content}>
                <div className={classes.container}>
                    <GridContainer justify="center">
                        <ItemGrid xs={12} sm={6} md={4}>
                            <form>
                                <LoginCard
                                    customCardClass={classes[this.state.cardAnimaton]}
                                    headerColor="rose"
                                    cardTitle="OAuth2 System"
                                    cardSubtitle=""
                                    footerAlign="center"
                                    statIconColor="success"
                                    // statLink={{ text: "忘记密码？", href: "#" }}
                                    footer={
                                        <Button round color="success" onClick={this.gologin}>
                                            登 录
                                        </Button>
                                    }
                                    // socials={[
                                    //   "fab fa-facebook-square",
                                    //   "fab fa-twitter",
                                    //   "fab fa-google-plus"
                                    // ].map((prop, key) => {
                                    //   return (
                                    //     <Button
                                    //       color="simple"
                                    //       justIcon
                                    //       key={key}
                                    //       customClass={classes.customButtonClass}
                                    //     >
                                    //       <i className={prop} />
                                    //     </Button>
                                    //   );
                                    // })}
                                    content={
                                        <div>
                                            <CustomInput
                                                labelText="账号或手机号码"
                                                id="uid"
                                                formControlProps={{
                                                    fullWidth: true,
                                                    onChange: this.handelInput("loginUid")
                                                }}
                                                inputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Face className={classes.inputAdornmentIcon}/>
                                                        </InputAdornment>
                                                    )
                                                }}
                                            />
                                            <CustomInput
                                                labelText="密码"
                                                id="pwd"
                                                formControlProps={{
                                                    fullWidth: true,
                                                    onChange: this.handelInput("loginPassword")
                                                }}
                                                inputProps={{
                                                    type: "password",
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <LockOutline
                                                                className={classes.inputAdornmentIcon}
                                                            />
                                                        </InputAdornment>
                                                    ),
                                                    onKeyPress: event =>
                                                        this.handleKeyPress(event),
                                                }}
                                            />
                                        </div>
                                    }
                                />
                            </form>
                        </ItemGrid>
                    </GridContainer>
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

LoginPage.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(loginPageStyle)(LoginPage);
