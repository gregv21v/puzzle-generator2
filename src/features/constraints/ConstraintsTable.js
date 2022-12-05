/**
 * ConstraintsTable - a table of constraints/properties for an object
 */

import { BooleanConstraint } from "./BooleanConstraint"
import { ColorConstraint } from "./ColorConstraint";
import { FloatConstraint } from "./FloatConstraint"
import { IntegerConstraint } from "./IntegerConstraint";
import { OptionConstraint } from "./OptionConstraint";
import { PointConstraint } from "./PointConstraint"
import { StringConstraint } from "./StringConstraint"


export function ConstraintsTable({root, constraints, updateConstraints, updateComputed}) {


    let optionTypes = {
        "shape" : [
            {label: "Free", value: "free"},
            {label: "Circle", value: "circle"},
            {label: "Sided", value: "sided"},
            {label: "Rectangle", value: "rectangle"},
            {label: "Shape2", value: "shape2"}, // the new shape type that uses vertices and edges
        ]
    }

    
    function renderConstraint(name) {
        //console.log("Name");
        switch(constraints[name].type) {
            case "string": 
                return (
                    <StringConstraint
                        key={name}
                        path={[...root, name]}
                        constraint={constraints[name]}
                        updateConstraints={updateConstraints}
                        updateComputed={updateComputed}
                    >
                    </StringConstraint>
                )
            case "point": 
                return (
                    <PointConstraint
                        key={name}
                        path={[...root, name]}
                        constraint={constraints[name]}
                        updateConstraints={updateConstraints}
                        updateComputed={updateComputed}
                    >
                    </PointConstraint>
                )   
            case "float":
                return (
                    <FloatConstraint
                        key={name}
                        path={[...root, name]}
                        constraint={constraints[name]}
                        updateConstraints={updateConstraints}
                        updateComputed={updateComputed}
                    >
                    </FloatConstraint>
                )  
            case "integer":
                return (
                    <IntegerConstraint
                        key={name}
                        path={[...root, name]}
                        constraint={constraints[name]}
                        updateConstraints={updateConstraints}
                        updateComputed={updateComputed}
                    >
                    </IntegerConstraint>
                )  
            case "boolean": 
                return (
                    <BooleanConstraint
                        key={name}
                        path={[...root, name]}
                        constraint={constraints[name]}
                        updateConstraints={updateConstraints}
                        updateComputed={updateComputed}
                    >
                    </BooleanConstraint>
                )  
            case "option": 
                return (
                    <OptionConstraint
                        key={name}
                        path={[...root, name]}
                        constraint={constraints[name]}
                        options={optionTypes[constraints[name].optionType]}
                        updateConstraints={updateConstraints}
                        updateComputed={updateComputed}
                    >
                    </OptionConstraint>
                ) 
            case "color": 
                return (
                    <ColorConstraint
                        key={name}
                        path={[...root, name]}
                        constraint={constraints[name]}
                        updateConstraints={updateConstraints}
                        updateComputed={updateComputed}
                    >
                    </ColorConstraint>
                ) 
            default: 
                return (
                    <td>
                        <tr colSpan="3">Empty</tr>
                    </td>
                )
        }
    }

    //console.log(constraints);

    return (
        <table style={{fontSize: 10}}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th colSpan={2}>Value</th>
                    <th>Computed</th>
                    <th>Enabled</th>
                </tr>
            </thead>
            <tbody>
                {
                    Object.keys(constraints).map(name => {
                        return renderConstraint(name);
                    })
                }
            </tbody>
        </table>
    )

}