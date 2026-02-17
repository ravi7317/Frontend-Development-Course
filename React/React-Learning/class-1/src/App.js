import "./App.css";
import Item from "./component/item";
import ItemDate from "./component/ItemDate";

function App() {
  const response = [
    {
      itemName: "Norma",
      itemDate: "20",
      itemMonth: "June",
      itemYear: "1998",
    },
    {
      itemName: "SurfExcl",
      itemDate: "24",
      itemMonth: "July",
      itemYear: "2024",
    },
    {
      itemName: "Ghari",
      itemDate: "25",
      itemMonth: "August",
      itemYear: "2000",
    },
  ];

  return (
    <div>
      <Item name={response[0].itemName} />
      <ItemDate
        day={response[0].itemDate}
        month={response[0].itemMonth}
        year={response[0].itemYear}
      />

      <Item name={response[1].itemName} />
      <ItemDate
        day={response[1].itemDate}
        month={response[1].itemMonth}
        year={response[1].itemYear}
      />

      <Item name={response[2].itemName} />
      <ItemDate
        day={response[2].itemDate}
        month={response[2].itemMonth}
        year={response[2].itemYear}
      />

      <div className="App">Hello ji</div>
    </div>
  );
}

export default App;
