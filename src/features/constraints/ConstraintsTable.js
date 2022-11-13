/**
 * ConstraintsTable - a table of constraints/properties for an object
 */

import { BooleanConstraint } from "./BooleanConstraint"
import { NumberConstraint } from "./NumberConstraint"
import { PointConstraint } from "./PointConstraint"
import { StringConstraint } from "./StringConstraint"


export function ConstraintsTable({root, constraints, updateConstraints, updateComputed}) {

    
    function renderConstraint(name) {
        console.log("Name");
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
            case "number":
                return (
                    <NumberConstraint
                        key={name}
                        path={[...root, name]}
                        constraint={constraints[name]}
                        updateConstraints={updateConstraints}
                        updateComputed={updateComputed}
                    >
                    </NumberConstraint>
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
        }
    }

    console.log(constraints);

    return (
        <tbody>
            {
                Object.keys(constraints).map(name => {
                    return renderConstraint(name);
                })
            }
        </tbody>
    )

}