import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
// material-ui icons
import Assignment from "material-ui-icons/Assignment";
import Face from "material-ui-icons/Face";
import Edit from "material-ui-icons/Edit";
import Close from "material-ui-icons/Close";
import KeyboardArrowRight from "material-ui-icons/KeyboardArrowRight";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "material-ui/Input/InputAdornment";
import http from "libs/http"
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
import defaultImage from "assets/img/default-avatar.png";
import AddAlert from "material-ui-icons/AddAlert";
import Snackbars from "components/Snackbar/Snackbar.jsx";

class ExtendedTables extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tc: false,
            alertcolor: "success",
            alertmsg: "null",

            checked: [],
            apps: [],
            eora: "a",
            showAdd: false,
            imagePreviewUrl: defaultImage,

            name: "",
            remark: "",
            avatar: "",
            safe_request: "",
            safe_upload: "",
            safe_download: "",
            safe_socket: "",
            app_id: "",
            discourse_sso_secret: "",
            discourse_sso_admin: "",
        };
        // this.handleAlert = this.handleAlert.bind(this);
    }

    style = {
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
            // float: "right!important"
            textAlign: "right"
        },
        clearfix: {
            "&:after,&:before": {
                display: "table",
                content: '" "'
            },
            clear: "both"
        },
        hideAdd: {
            display: "none"
        },
        showAdd: {
            display: "table",
        }
    };

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
                if (this.verifyCnMobile(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "mail":
                if (this.verifyMail(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "code":
                if (this.verifyCode(event.target.value)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            case "nick":
                if (this.verifyLength(event.target.value, 2)) {
                    this.setState({[stateName + "State"]: "success"});
                } else {
                    this.setState({[stateName + "State"]: "error"});
                }
                break;
            default:
                break;
        }
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

    AddApp = () => {
        http.post("/api/v1/apps", {
            name: this.state.name,
            remark: this.state.remark,
            avatar: this.state.avatar,
            safe_request: this.state.safe_request,
            safe_upload: this.state.safe_upload,
            safe_download: this.state.safe_download,
            safe_socket: this.state.safe_socket,
            discourse_sso_secret: this.state.discourse_sso_secret,
            discourse_sso_admin: this.state.discourse_sso_admin,
        }).then(res => {
            if (res.data.ok) {
                this.setState({
                    alertcolor: "success",
                    alertmsg: "操作成功"
                });
                this.showNotification("tc")
                this.setState({showAdd: false})
                this.loadData()
            } else {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc")
            }
        })
    }
    editApp = () => {
        http.put("/api/v1/app/" + this.state.app_id, {
            name: this.state.name,
            remark: this.state.remark,
            avatar: this.state.avatar,
            safe_request: this.state.safe_request,
            safe_upload: this.state.safe_upload,
            safe_download: this.state.safe_download,
            safe_socket: this.state.safe_socket,
            discourse_sso_secret: this.state.discourse_sso_secret,
            discourse_sso_admin: this.state.discourse_sso_admin,
        }).then(res => {
            if (res.data.ok) {
                this.setState({
                    alertcolor: "success",
                    alertmsg: "操作成功"
                });
                this.showNotification("tc")
                this.setState({showAdd: false})
                this.loadData()
            } else {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc")
            }
        })
    }

    delApp(id) {
        http.delete("/api/v1/app/" + id).then(res => {
            if (res.data.ok) {
                this.setState({
                    alertcolor: "success",
                    alertmsg: "操作成功"
                });
                this.showNotification("tc")
                this.loadData()
            } else {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc")
            }
        })
    }

    UpdateAppSecret(id) {
        http.put("/api/v1/appsecret/" + id).then(res => {
            if (res.data.ok) {
                this.setState({
                    alertcolor: "success",
                    alertmsg: "操作成功"
                });
                this.showNotification("tc");
                this.loadData()
            } else {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg
                });
                this.showNotification("tc")
            }
        })
    }

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
                        avatar: res.data.data[0]
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

    componentWillMount() {
        this.loadData()
    }

    loadData() {
        http.get("/api/v1/apps").then(res => {
            if (res.data.ok && res.data.data != null) {
                this.setState({
                    apps: res.data.data
                })
            } else {
                this.setState({
                    alertcolor: "danger",
                    alertmsg: res.data.errmsg === "" ? res.data.errmsg : "没有任何记录"
                });
                this.showNotification("tc")
            }
        })
    }

    render() {
        const {classes} = this.props;
        return (
            <GridContainer>
                <ItemGrid xs={12}>
                    <IconCard
                        icon={Assignment}
                        iconColor="rose"
                        title="应用列表"
                        content={
                            <Table
                                tableHead={[
                                    "图标",
                                    "祥情",
                                    "操作",
                                ]}
                                tableData={
                                    this.state.apps.map(i => {
                                        return [
                                            <div className={classes.imgContainer}>
                                                <img src={i.avatar} alt="..." className={classes.img}/>
                                            </div>,
                                            <span>
                                                 <small className={classes.tdNameAnchor}>
                                                  {i.name}
                                                </small>
                                                <br/>
                                                <small className={classes.tdNameSmall}>
                                                  AppID：{i.app_id}
                                                </small>
                                                <br/>
                                                <small className={classes.tdNameSmall}>
                                                  AppSecret：{i.app_secret}
                                                </small>
                                                <br/>
                                                <small className={classes.tdNameSmall}>
                                                  App安全域名：{i.safe_request}
                                                </small>
                                                <br/>
                                                <small className={classes.tdNameSmall}>
                                                  App安全上传域名：{i.safe_upload}
                                                </small>
                                                <br/>
                                                <small className={classes.tdNameSmall}>
                                                  App安全下载域名：{i.safe_download}
                                                </small>
                                                <br/>
                                                <small className={classes.tdNameSmall}>
                                                  App安全WebSocket域名：{i.safe_socket}
                                                </small>
                                                <br/>
                                                <small className={classes.tdNameSmall}>
                                                  Discourse论坛SSO_Secret：{i.discourse_sso_secret}
                                                </small>
                                                <br/>
                                                <small className={classes.tdNameSmall}>
                                                  Discourse论坛SSO管理员ID(填写本站UID)：{i.discourse_sso_admin}
                                                </small>
                                            </span>,
                                            <Button color="info" customClass={classes.actionButton} onClick={
                                                () => {
                                                    this.setState({
                                                        name: i.name,
                                                        remark: i.remark,
                                                        avatar: i.avatar,
                                                        safe_request: i.safe_request,
                                                        safe_upload: i.safe_upload,
                                                        safe_download: i.safe_download,
                                                        safe_socket: i.safe_socket,
                                                        app_id: i.app_id,
                                                        discourse_sso_secret: i.discourse_sso_secret,
                                                        discourse_sso_admin: i.discourse_sso_admin,
                                                        showAdd: true,
                                                        eora: "e",
                                                    })
                                                }
                                            }>
                                                <Edit className={classes.icon}/>编辑
                                            </Button>,
                                            <Button color="rose" customClass={classes.actionButton}
                                                    onClick={this.UpdateAppSecret.bind(this, i.app_id)}>
                                                <Edit className={classes.icon}/>更换Secret
                                            </Button>,
                                            <Button color="danger" customClass={classes.actionButton}
                                                    onClick={this.delApp.bind(this, i.app_id)}>
                                                <Close className={classes.icon}/>删除
                                            </Button>,
                                        ]
                                    })
                                }
                            />
                        }
                        footer={
                            <Button color="primary" onClick={() => this.setState({
                                name: "",
                                remark: "",
                                avatar: "",
                                discourse_sso_secret: "",
                                discourse_sso_admin:"",
                                safe_request: "",
                                safe_upload: "",
                                safe_download: "",
                                safe_socket: "",
                                showAdd: true,
                                eora: "a",
                            })} round>
                                创建应用{" "}
                                <KeyboardArrowRight className={classes.icon} />
                            </Button>
                        }
                    />
                </ItemGrid>
                <ItemGrid xs={12} style={this.state.showAdd ? this.style.showBox : this.style.hideAdd}>
                    <IconCard
                        icon={Assignment}
                        iconColor="rose"
                        title="应用信息"
                        content={
                            <div>
                                <ItemGrid xs={12}>
                                    <div className="picture-container">
                                        <div className="picture">
                                            <img
                                                src={this.state.avatar}
                                                className="picture-src"
                                                alt="..."
                                            />
                                            <input type="file" onChange={e => this.handleImageChange(e)}/>
                                        </div>
                                        <h6 className="description">上传头像</h6>
                                    </div>
                                </ItemGrid>
                                <CustomInput
                                    success={this.state.nicknameState === "success"}
                                    error={this.state.nicknameState === "error"}
                                    labelText={
                                        <span>
                      应用名称
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
                                            this.change(event, "name", "name"),
                                        value: this.state.name
                                    }}
                                />
                                <CustomInput
                                    success={this.state.nicknameState === "success"}
                                    error={this.state.nicknameState === "error"}
                                    labelText={
                                        <span>
                      应用说明
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
                                            this.change(event, "remark", "remark"),
                                        value: this.state.remark
                                    }}
                                />
                                <CustomInput
                                    success={this.state.nicknameState === "success"}
                                    error={this.state.nicknameState === "error"}
                                    labelText={
                                        <span>
                      安全域名
                            </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" style={this.style.inputAdornment}>
                                                <Face style={this.style.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "safe_request", "safe_request"),
                                        value: this.state.safe_request
                                    }}
                                />
                                <CustomInput
                                    success={this.state.nicknameState === "success"}
                                    error={this.state.nicknameState === "error"}
                                    labelText={
                                        <span>
                      安全文件上传域名
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
                                            this.change(event, "safe_upload", "safe_upload"),
                                        value: this.state.safe_upload
                                    }}
                                />
                                <CustomInput
                                    success={this.state.nicknameState === "success"}
                                    error={this.state.nicknameState === "error"}
                                    labelText={
                                        <span>
                      安全文件下载域名
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
                                            this.change(event, "safe_download", "safe_download"),
                                        value: this.state.safe_download
                                    }}
                                />
                                <CustomInput
                                    success={this.state.nicknameState === "success"}
                                    error={this.state.nicknameState === "error"}
                                    labelText={
                                        <span>
                      安全WEBSOCKET域名
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
                                            this.change(event, "safe_socket", "safe_socket"),
                                        value: this.state.safe_socket
                                    }}
                                />
                                <CustomInput
                                    success={this.state.nicknameState === "success"}
                                    error={this.state.nicknameState === "error"}
                                    labelText={
                                        <span>
                                          Discourse论坛SSO_Secret
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
                                            this.change(event, "discourse_sso_secret", "discourse_sso_secret"),
                                        value: this.state.discourse_sso_secret
                                    }}
                                />
                                <CustomInput
                                    success={this.state.nicknameState === "success"}
                                    error={this.state.nicknameState === "error"}
                                    labelText={
                                        <span>
                                          Discourse论坛SSO_Secret
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
                                            this.change(event, "discourse_sso_admin", "discourse_sso_admin"),
                                        value: this.state.discourse_sso_admin
                                    }}
                                />
                                <div style={this.style.footer}>
                                    <div style={this.style.right}>
                                        <Button
                                            customClass={this.props.nextButtonClasses}
                                            onClick={() => this.setState({showAdd: false})}>
                                            取 消
                                        </Button>
                                        {this.state.eora === "a" ?
                                            <Button
                                                color="rose"
                                                customClass={this.props.nextButtonClasses}
                                                onClick={this.AddApp}>
                                                新 增
                                            </Button> :
                                            <Button
                                                color="rose"
                                                customClass={this.props.nextButtonClasses}
                                                onClick={this.editApp}>
                                                修 改
                                            </Button>
                                        }
                                    </div>
                                    <div style={this.style.clearfix}/>
                                </div>
                            </div>
                        }

                    />
                </ItemGrid>
                <Snackbars
                    place="tc"
                    color={this.state.alertcolor}
                    icon={AddAlert}
                    message={this.state.alertmsg}
                    open={this.state.tc}
                    closeNotification={() => this.setState({tc: false})}
                    close
                />
            </GridContainer>
        );
    }
}

export default withStyles(extendedTablesStyle)(ExtendedTables);
