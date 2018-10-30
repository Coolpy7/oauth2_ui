import React from "react";
// material-ui-icons
import Face from "material-ui-icons/Face";
import RecordVoiceOver from "material-ui-icons/RecordVoiceOver";
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
import defaultImage from "assets/img/default-avatar.png";

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

class Step1 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tc: false,
            alertcolor: "success",
            alertmsg: "null",
            nickname: "",
            nicknameState: "",
            remark: "",
            remarkState: "",
            file: null,
            avatar: "",
            imagePreviewUrl: defaultImage
        };
    }

    componentDidMount() {
        // we add a hidden class to the card and after 700 ms we delete it and the transition appears
        let uinfo = JSON.parse(sessionStorage.getItem("userinfo"));
        this.setState({
            avatar: uinfo.avatar,
            imagePreviewUrl: uinfo.avatar,
            nickname: uinfo.name,
            remark: uinfo.remark
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
                if (Step1.verifyCnMobile(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "mail":
                if (Step1.verifyMail(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "code":
                if (Step1.verifyCode(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "nick":
                if (Step1.verifyLength(event.target.value, 2)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            default:
                break;
        }
    }

    UpdateInfo = () => {
        if (!Step1.verifyLength(this.state.nickname, 2)) {
            return
        }

        if (!Step1.verifyLength(this.state.remark, 2)) {
            return
        }

        let uobj = {};
        if (this.state.nickname !== "") {
            uobj["name"] = this.state.nickname;
        }
        if (this.state.remark !== "") {
            uobj["remark"] = this.state.remark;
        }

        if (this.state.avatar !== this.state.imagePreviewUrl) {
            uobj["avatar"] = this.state.imagePreviewUrl
        }

        http.post("/api/v1/info", uobj).then(res => {
            if (res.data.ok) {
                //本地更新头像
                let uif = sessionStorage.getItem("userinfo");
                if (uif == null) {
                    window.location = "/pages/login-page";
                    return
                }
                let uinfo = JSON.parse(uif);
                uinfo.name = uobj["name"];
                uinfo.remark = uobj["remark"];
                uinfo.avatar = uobj["avatar"];
                sessionStorage.setItem("userinfo", JSON.stringify(uinfo));

                this.setState({
                    alertcolor: "success",
                    alertmsg: "操作成功"
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
            if (err.toString().includes("401")) {
                window.location = "/pages/login-page"
            }
            this.setState({
                alertcolor: "danger",
                alertmsg: err.toString(),
            });
            this.showNotification("tc")
        });
    };

    handleImageChange(e) {
        e.preventDefault();
        let reader = new FileReader();
        let file = e.target.files[0];
        reader.onloadend = () => {
            http.post("/api/v1/avatar", reader.result).then(res => {
                if (!res.data.ok) {
                    this.setState({
                        alertcolor: "danger",
                        alertmsg: res.data.errmsg
                    });
                    this.showNotification("tc")
                } else {
                    this.setState({
                        file: file,
                        imagePreviewUrl: res.data.data[0]
                    });
                    let uobj = {};
                    if (this.state.avatar !== this.state.imagePreviewUrl) {
                        uobj["avatar"] = this.state.imagePreviewUrl
                        //本地更新头像
                        let uif = sessionStorage.getItem("userinfo");
                        if (uif == null) {
                            window.location = "/pages/login-page";
                            return
                        }
                        let uinfo = JSON.parse(uif);
                        uinfo.avatar = uobj["avatar"];
                        sessionStorage.setItem("userinfo", JSON.stringify(uinfo));
                    }
                    http.post("/api/v1/info", uobj).then(res => {
                        if (res.data.ok) {
                            this.setState({
                                alertcolor: "success",
                                alertmsg: "操作成功"
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
                        if (err.toString().includes("401")) {
                            window.location = "/pages/login-page"
                        }
                        this.setState({
                            alertcolor: "danger",
                            alertmsg: err.toString(),
                        });
                        this.showNotification("tc")
                    });
                }
            }).catch(err => {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: err
                });
                this.showNotification("tc")
            })

        };
        reader.readAsArrayBuffer(file);
    }

    render() {
        const {classes} = this.props;
        return (
            <div>
                <GridContainer justify="center">
                    <ItemGrid xs={12} sm={12}>
                        <h4 className={classes.infoText}>
                            点击修改头像，或修改昵称。
                        </h4>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={4}>
                        <div className="picture-container">
                            <div className="picture">
                                <img
                                    src={this.state.imagePreviewUrl}
                                    className="picture-src"
                                    alt="..."
                                />
                                <input type="file" onChange={e => this.handleImageChange(e)}/>
                            </div>
                            <h6 className="description">上传头像</h6>
                        </div>
                    </ItemGrid>
                    <ItemGrid xs={12} sm={6}>
                        <CustomInput
                            success={this.state.nicknameState === "success"}
                            error={this.state.nicknameState === "error"}
                            labelText={
                                <span>
                                    昵称
                                </span>
                            }
                            formControlProps={{
                                fullWidth: true
                            }}
                            inputProps={{
                                endAdornment: (
                                    <InputAdornment position="end" className={classes.inputAdornment}>
                                        <Face className={classes.inputAdornmentIcon}/>
                                    </InputAdornment>
                                ),
                                onChange: event =>
                                    this.change(event, "nickname", "nick"),
                                value: this.state.nickname
                            }}
                        />
                        <CustomInput
                            success={this.state.remarkState === "success"}
                            error={this.state.remarkState === "error"}
                            labelText={
                                <span>
                                    个性签名
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
                                    this.change(event, "remark", "nick"),
                                value: this.state.remark
                            }}
                        />
                        <div className={classes.footer}>
                            <div className={classes.right}>
                                <Button
                                    color="rose"
                                    customClass={this.props.nextButtonClasses}
                                    onClick={this.UpdateInfo}>
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

export default withStyles(style)(Step1);
