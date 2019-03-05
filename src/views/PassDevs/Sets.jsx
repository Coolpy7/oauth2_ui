import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
// material-ui icons
import Assignment from "material-ui-icons/Assignment";
import Settings from "material-ui-icons/Settings";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import Button from "components/CustomButtons/Button.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx";
import InputAdornment from "material-ui/Input/InputAdornment";
import http from "libs/http"
import extendedTablesStyle from "assets/jss/material-dashboard-pro-react/views/extendedTablesStyle.jsx";
// import defaultImage from "assets/img/faces/avatar.png";
import AddAlert from "material-ui-icons/AddAlert";
import Snackbars from "components/Snackbar/Snackbar.jsx";

class Sets extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tc: false,
            alertcolor: "success",
            alertmsg: "null",

            header: "",
            headerState:"",
            // footer: "",
            // footerState: "",
            // footerurl:"",
            regpaper: "",
            regpaperState: "",
            help: "",
            helpState: "",
            authicon: "",
            authiconState: "",
            authpaper: "",
            authpaperState: "",
            authwaring: "",
            authwaringState: "",
            mailsubject:"",
            mailbody:"",
            smssign:"",
            smstemplate:"",
            mailalias:"",
            mailservice:""
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

    change(event, stateName, type) {
        this.setState({
            [stateName]: event.target.value,
        });
        switch (type) {
            case "password":
                if (Sets.verifyLength(event.target.value, 6)) {
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

    editApp = () => {
        http.put("/api/v1/config", {
            header: this.state.header,
            // footer: this.state.footer,
            // footerurl: this.state.footerurl,
            regpaper: this.state.regpaper,
            help: this.state.help,
            authicon: this.state.authicon,
            authpaper: this.state.authpaper,
            authwaring: this.state.authwaring,
            mailsubject: this.state.mailsubject,
            mailbody: this.state.mailbody,
            smssign:this.state.smssign,
            smstemplate:this.state.smstemplate,
            mailalias:this.state.mailalias,
            mailservice:this.state.mailservice
        }).then(res => {
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
                        authicon: res.data.data[0],
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
        http.get("/api/v1/configs").then(res => {
            if (res.data.ok) {
                this.setState({
                    header: res.data.data[0].header,
                    // footer: res.data.data[0].footer,
                    // footerurl: res.data.data[0].footerurl,
                    regpaper: res.data.data[0].regpaper,
                    help: res.data.data[0].help,
                    authicon: res.data.data[0].authicon,
                    authpaper: res.data.data[0].authpaper,
                    authwaring: res.data.data[0].authwaring,
                    mailsubject: res.data.data[0].mailsubject,
                    mailbody: res.data.data[0].mailbody,
                    smssign:res.data.data[0].smssign,
                    smstemplate:res.data.data[0].smstemplate,
                    mailalias:res.data.data[0].mailalias,
                    mailservice:res.data.data[0].mailservice
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
            <GridContainer>
                <ItemGrid xs={12}>
                    <IconCard
                        icon={Assignment}
                        iconColor="rose"
                        title="系统参数"
                        content={
                            <div>
                                <ItemGrid xs={12}>
                                    <div className="picture-container">
                                        <div className="picture">
                                            <img
                                                src={this.state.authicon}
                                                className="picture-src"
                                                alt="..."
                                            />
                                            <input type="file" onChange={e => this.handleImageChange(e)}/>
                                        </div>
                                        <h6 className="description">系统头像</h6>
                                    </div>
                                </ItemGrid>
                                <CustomInput
                                    success={this.state.headerState === "success"}
                                    error={this.state.headerState === "error"}
                                    labelText={
                                        <span>
                                              系统名称
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "header", "nick"),
                                        value: this.state.header
                                    }}
                                />
                                {/*<CustomInput*/}
                                    {/*success={this.state.footerState === "success"}*/}
                                    {/*error={this.state.footerState === "error"}*/}
                                    {/*labelText={*/}
                                        {/*<span>*/}
                                            {/*系统脚部版权信息*/}
                                        {/*</span>*/}
                                    {/*}*/}
                                    {/*formControlProps={{*/}
                                        {/*fullWidth: true*/}
                                    {/*}}*/}
                                    {/*inputProps={{*/}
                                        {/*endAdornment: (*/}
                                            {/*<InputAdornment position="end" className={classes.inputAdornment}>*/}
                                                {/*<Face className={classes.inputAdornmentIcon}/>*/}
                                            {/*</InputAdornment>*/}
                                        {/*),*/}
                                        {/*onChange: event =>*/}
                                            {/*this.change(event, "footer", "nick"),*/}
                                        {/*value: this.state.footer*/}
                                    {/*}}*/}
                                {/*/>*/}
                                {/*<CustomInput*/}
                                    {/*success={this.state.footerurlState === "success"}*/}
                                    {/*error={this.state.footerurlState === "error"}*/}
                                    {/*labelText={*/}
                                        {/*<span>*/}
                                            {/*系统脚部链接*/}
                                        {/*</span>*/}
                                    {/*}*/}
                                    {/*formControlProps={{*/}
                                        {/*fullWidth: true*/}
                                    {/*}}*/}
                                    {/*inputProps={{*/}
                                        {/*endAdornment: (*/}
                                            {/*<InputAdornment position="end" className={classes.inputAdornment}>*/}
                                                {/*<Face className={classes.inputAdornmentIcon}/>*/}
                                            {/*</InputAdornment>*/}
                                        {/*),*/}
                                        {/*onChange: event =>*/}
                                            {/*this.change(event, "footerurl", "nick"),*/}
                                        {/*value: this.state.footerurl*/}
                                    {/*}}*/}
                                {/*/>*/}
                                <CustomInput
                                    success={this.state.regpaperState === "success"}
                                    error={this.state.regpaperState === "error"}
                                    labelText={
                                        <span>
                                            用户注册协议
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" style={this.style.inputAdornment}>
                                                <Settings style={this.style.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "regpaper", "nick"),
                                        value: this.state.regpaper
                                    }}
                                />
                                <CustomInput
                                    success={this.state.helpState === "success"}
                                    error={this.state.helpState === "error"}
                                    labelText={
                                        <span>
                                            系统联系人信息
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "help", "nick"),
                                        value: this.state.help
                                    }}
                                />
                                <CustomInput
                                    success={this.state.authpaperState === "success"}
                                    error={this.state.authpaperState === "error"}
                                    labelText={
                                        <span>
                                            OAUTH授权协议
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "authpaper", "nick"),
                                        value: this.state.authpaper
                                    }}
                                />
                                <CustomInput
                                    success={this.state.authwaringState === "success"}
                                    error={this.state.authwaringState === "error"}
                                    labelText={
                                        <span>
                                          系统安全提示信息
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "authwaring", "nick"),
                                        value: this.state.authwaring
                                    }}
                                />
                                <CustomInput
                                    success={this.state.authwaringState === "success"}
                                    error={this.state.authwaringState === "error"}
                                    labelText={
                                        <span>
                                          阿里云验证邮箱服务（企业名称,必须与阿里云短信模板对应的企业名称）
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "mailalias", "nick"),
                                        value: this.state.mailalias
                                    }}
                                />
                                <CustomInput
                                    success={this.state.authwaringState === "success"}
                                    error={this.state.authwaringState === "error"}
                                    labelText={
                                        <span>
                                          阿里云验证服务邮箱（服务邮箱,必须与阿里云短信模板对应的服务邮箱）
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "mailservice", "nick"),
                                        value: this.state.mailservice
                                    }}
                                />
                                <CustomInput
                                    success={this.state.authwaringState === "success"}
                                    error={this.state.authwaringState === "error"}
                                    labelText={
                                        <span>
                                          邮箱验证邮件标题
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "mailsubject", "nick"),
                                        value: this.state.mailsubject
                                    }}
                                />
                                <CustomInput
                                    success={this.state.authwaringState === "success"}
                                    error={this.state.authwaringState === "error"}
                                    labelText={
                                        <span>
                                          邮箱验证邮件内容 ":vcode" 双引号内内容为验证码通配符
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "mailbody", "nick"),
                                        value: this.state.mailbody
                                    }}
                                />
                                <CustomInput
                                    success={this.state.authwaringState === "success"}
                                    error={this.state.authwaringState === "error"}
                                    labelText={
                                        <span>
                                          阿里云通信短信服务（签名）
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "smssign", "nick"),
                                        value: this.state.smssign
                                    }}
                                />
                                <CustomInput
                                    success={this.state.authwaringState === "success"}
                                    error={this.state.authwaringState === "error"}
                                    labelText={
                                        <span>
                                          阿里云通信短信服务（模板编号）
                                        </span>
                                    }
                                    formControlProps={{
                                        fullWidth: true
                                    }}
                                    inputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end" className={classes.inputAdornment}>
                                                <Settings className={classes.inputAdornmentIcon}/>
                                            </InputAdornment>
                                        ),
                                        onChange: event =>
                                            this.change(event, "smstemplate", "nick"),
                                        value: this.state.smstemplate
                                    }}
                                />
                                <div style={this.style.footer}>
                                    <div style={this.style.right}>
                                        <Button
                                            color="rose"
                                            customClass={this.props.nextButtonClasses}
                                            onClick={this.editApp}>
                                            修 改
                                        </Button>
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

export default withStyles(extendedTablesStyle)(Sets);
