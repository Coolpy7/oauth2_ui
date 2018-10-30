import React from "react";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
// material-ui icons
import Assignment from "material-ui-icons/Assignment";
import Close from "material-ui-icons/Close";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import IconCard from "components/Cards/IconCard.jsx";
import Table from "components/Table/Table.jsx";
import Button from "components/CustomButtons/Button.jsx";
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
            auths: [],
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

    del = (id) => {
        http.get("/api/v1/auth/" + id, {}).then(res => {
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
        http.get("/api/v1/auths").then(res => {
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
                <ItemGrid xs={12}>
                    <IconCard
                        icon={Assignment}
                        iconColor="rose"
                        title="已授权应用列表"
                        content={
                            <Table
                                tableHead={[
                                    "App图标",
                                    "App名称",
                                    "scope",
                                    "授权时间",
                                    "操作",
                                ]}
                                tableData={
                                    this.state.auths.map(i => {
                                        return [
                                            <div className={classes.imgContainer}>
                                                <img src={i.app.avatar} alt="..." className={classes.img}/>
                                            </div>,
                                            <span>
                                                 <small className={classes.tdNameAnchor}>
                                                 {i.app.name}
                                                </small>
                                            </span>,
                                            <span>
                                                <small className={classes.tdNameAnchor}>
                                                 {i.scope}
                                                </small>
                                            </span>,
                                            <span>
                                                <small className={classes.tdNameAnchor}>
                                                 {i.create_at}
                                                </small>
                                            </span>,
                                            <Button color="danger" customClass={classes.actionButton}
                                                    onClick={this.del.bind(this, i._id)}>
                                                <Close className={classes.icon}/>取消授权
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
