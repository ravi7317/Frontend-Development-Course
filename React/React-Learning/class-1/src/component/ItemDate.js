import './ItemDate.css';

function Date(props){
    const day = props.day
    const month = props.month
    const year = props.year
    return (
    <div className='Date'>
        <span>{day}</span>
        <span>{month} </span>
        <span>{year}</span>
    </div>
    );
}
export  default Date;