import './item.css'
function Item(props){
    const itemName = props.name
    return (<p className="name">{itemName}</p>);
}
export default Item;