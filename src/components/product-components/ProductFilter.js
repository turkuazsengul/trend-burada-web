import React, {useState} from 'react';
import {Checkbox} from 'primereact/checkbox';
import {Accordion, AccordionTab} from 'primereact/accordion';

export const ProductFilter = ({filterItemList: filterItem}) => {

    const [genders, setGenders] = useState([]);

    const onGenderChange = (e) => {
        let selectedGender = [...genders];

        if (e.checked)
            selectedGender.push(e.value);
        else
            selectedGender.splice(selectedGender.indexOf(e.value), 1);

        setGenders(selectedGender);
    }

    const filterItemList = filterItem.map((x) => {
        return (
            <div key={x.id} className="product-filter-items">
                <Accordion multiple activeIndex={[0]}>
                    <AccordionTab header={x.title}>
                        {x.filterItems.map((y) => {
                            return (
                                <div key={y.id} className="field-checkbox">
                                    <Checkbox inputId="w" name="woman" value={y.value} onChange={onGenderChange} checked={genders.indexOf(y.value) !== -1}/>
                                    <label htmlFor="woman">{y.value}</label>
                                </div>
                            )
                        })}
                    </AccordionTab>
                </Accordion>
                <hr/>
            </div>
        )
    })

    return (
        <div>
            {filterItemList}
        </div>

    )
}

