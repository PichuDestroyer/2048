import React, {useEffect, useState} from 'react';
import usePreviousProps from '../Hook/use-previous-props';

const Tile = (props) => {
    const previousValue = usePreviousProps(props.value);
    const hasChanged = props.value !== previousValue && props.value > previousValue;
    const [extrClass, setExtraClass] = useState('');
    useEffect(()=>{
        if (hasChanged){
            setExtraClass("tile-popup");
            setTimeout(()=>{
                setExtraClass('')
            },200);
        }
    }, [hasChanged])
    const getValueColor = (value) => {
        switch (value) {
            case null:
                return '#cdc1b4';
            case 2:
                return '#7986CB';
            case 4:
                return '#5C6BC0';
            case 8:
                return '#3F51B5';
            case 16:
                return '#E57373';
            case 32:
                return '#EF5350';
            case 64:
                return '#F44336';
            case 128:
                return '#9C27B0';
            case 256:
                return '#edcc61';
            case 512:
                return '#edc850';
            case 1024:
                return '#edc53f';
            case 2048:
                return '#edc22e';
            default:
                return '#ffffff'; // Default color if the value doesn't match any case
            }
        };
        const tileStyle = {
            backgroundColor: getValueColor(props.value),
            transition: 'scale .2s'
        };
    return (
        <div className={`tile ${extrClass}`} style={tileStyle}>
            {props.value}
        </div>
    );
};
export default Tile;