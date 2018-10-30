import React from "react";
// core components
import Wizard from "components/Wizard/Wizard.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import ItemGrid from "components/Grid/ItemGrid.jsx";

import Step1 from "./WizardSteps/Step1.jsx";
import Step2 from "./WizardSteps/Step2.jsx";
import Step3 from "./WizardSteps/Step3.jsx";
import Step4 from "./WizardSteps/Step4.jsx";

class WizardView extends React.Component {
    render() {
        return (
            <GridContainer justify="center">
                <ItemGrid xs={12} sm={8}>
                    <Wizard
                        validate
                        steps={[
                            {stepName: "个人档案", stepComponent: Step1, stepId: "about"},
                            {stepName: "手机号", stepComponent: Step2, stepId: "account"},
                            {stepName: "电子邮箱", stepComponent: Step3, stepId: "address"},
                            {stepName: "密码", stepComponent: Step4, stepId: "pwd"},
                        ]}
                        title="用户信息"
                        subtitle="修改个人信息"
                    />
                </ItemGrid>
            </GridContainer>
        );
    }
}

export default WizardView;
