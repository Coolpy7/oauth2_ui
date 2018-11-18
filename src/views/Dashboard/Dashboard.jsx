import React from "react";
import PropTypes from "prop-types";
// material-ui components
import withStyles from "material-ui/styles/withStyles";
// core components
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";
import Button from "components/CustomButtons/Button.jsx";
import ProfileCard from "components/Cards/ProfileCard.jsx";
import AddAlert from "material-ui-icons/AddAlert";
import Snackbars from "components/Snackbar/Snackbar.jsx";
import avatar from "assets/img/faces/avatar.png";

import dashboardStyle from "assets/jss/material-dashboard-pro-react/views/dashboardStyle";

// material-ui-icons

import http from "libs/http";

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            tc: false,
            alertcolor: "success",
            alertmsg: "null",
            uinfo :{}
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

    componentDidMount() {
        let uif = sessionStorage.getItem("userinfo");
        if (uif == null) {
            window.location = "/pages/login-page";
            return
        }
        let uinfo = JSON.parse(uif);
        this.setState({
            uinfo: uinfo
        })
    }

    Update = () => {
        if (this.state.uinfo.rule === "developer") {
            this.setState({
                alertcolor: "danger",
                alertmsg: "您已经是开发者，无需再提交申请"
            });
            this.showNotification("tc");
            return
        }
        http.post("/api/v1/forms", {}).then(res => {
            if (res.data.ok) {
                this.setState({
                    alertcolor: "success",
                    alertmsg: "开发者申请已提交，请耐心等待管理员审核."
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
            // console.log(err);
            this.setState({
                alertcolor: "danger",
                alertmsg: "网络环境异常，系统无法正常访问服务器"
            });
            this.showNotification("tc")
        });
    };

    render() {
        return (
            <div>
                <GridContainer>
                    <ItemGrid xs={12} sm={12} md={4}>
                        <ProfileCard
                            avatar={this.state.uinfo.avatar != null?this.state.uinfo.avatar:avatar}
                            subtitle={this.state.uinfo.rule}
                            title={this.state.uinfo.name}
                            userid={this.state.uinfo.uid}
                            phone={this.state.uinfo.phone}
                            mail={this.state.uinfo.mail}
                            description={this.state.uinfo.remark}
                            content={
                                <Button color="rose" onClick={this.Update} round>
                                    申请成为开发者
                                </Button>
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
                    closeNotification={() => this.setState({tc: false})}
                    close
                />
            </div>
        );
    }
}

Dashboard.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
