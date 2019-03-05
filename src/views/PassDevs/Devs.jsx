import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
// material-ui icons
import Assignment from "material-ui-icons/Assignment";
import Face from "material-ui-icons/Face";
import Close from "material-ui-icons/Close";
import Add from "material-ui-icons/Add";
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
            forms: [],

            form_id: "",
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

    update = (fid, ps) => {
        http.put("/api/v1/form/" + fid + "?result=" + ps, {}).then(res => {
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

    componentWillMount() {
        this.loadData()
    }

    loadData() {
        http.get("/api/v1/forms").then(res => {
            if (res.data.ok && res.data.data != null) {
                this.setState({
                    auths: res.data.data
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
                <ItemGrid xs={12}>
                    <IconCard
                        icon={Assignment}
                        iconColor="rose"
                        title="申请成为开发者待审列表"
                        content={
                            <Table
                                tableHead={[
                                    "用户ID",
                                    "姓名",
                                    "电话",
                                    "邮箱",
                                    "申请时间",
                                    "状态",
                                    "操作",
                                ]}
                                tableData={
                                    this.state.forms.map(i => {
                                        return [
                                            <span>
                                                 <small className={classes.tdNameAnchor}>
                                                 {i.user.uid}
                                                </small>
                                            </span>,
                                            <span>
                                                <small className={classes.tdNameAnchor}>
                                                 {i.user.name}
                                                </small>
                                            </span>,
                                            <span>
                                                <small className={classes.tdNameAnchor}>
                                                 {i.user.phone}
                                                </small>
                                            </span>,
                                            <span>
                                                 <small className={classes.tdNameAnchor}>
                                                 {i.user.mail}
                                                </small>
                                            </span>,
                                            <span>
                                                 <small className={classes.tdNameAnchor}>
                                                 {i.createat}
                                                </small>
                                            </span>,
                                            <span>
                                                <small className={classes.tdNameAnchor}>
                                                  {i.state}
                                                </small>
                                            </span>,
                                            <span>
                                                <small className={classes.tdNameAnchor}>
                                                  {i.result}
                                                </small>
                                            </span>,
                                            <Button color="success" customClass={classes.actionButton}
                                                    onClick={this.update.bind(this, i._id, "0")}>
                                                <Add className={classes.icon}/>通过
                                            </Button>,
                                            <Button color="danger" customClass={classes.actionButton}
                                                    onClick={this.update.bind(this, i._id, "1")}>
                                                <Close className={classes.icon}/>拒绝
                                            </Button>,
                                        ]
                                    })
                                }
                            />
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
