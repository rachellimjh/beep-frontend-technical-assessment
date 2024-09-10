import { useState } from "react";
import axios from "axios";
import Autocomplete from "./components/AutoComplete.tsx";

//api key: 3963830badae5cf688a1b7f80382bc9a
type Option = string | { label: string; value: string };

const options: Option[] = [
  "Apple",
  "Banana",
  { label: "Orange", value: "orange" },
  { label: "Grapes", value: "grapes" },
];

// React.useEffect(() => {
//   const fetchData = async () => {
//     const { data } = await axios.get(
//       "https://restcountries.com/v3.1/all?fields=name,currencies"
//     );
//     console.log(data);
//     setFilteredOptions(data);
//   };
//   fetchData();

function App() {
  const handleSelect = (value: Option | Option[]) => {
    console.log("Selected:", value);
  };
  return (
    <div>
      <div className="w-screen h-screen p-6 bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-md max-w-md p-6 shadow-sm">
          <div className="flex flex-col justify-center space-y-6">
            <Autocomplete
              disabled={false}
              options={options}
              label="Async Search"
              placeholder="Type to begin searching"
              onChange={handleSelect}
              description="With description and custom results display"
              multiple={true}
            />
            <Autocomplete
              disabled={false}
              options={options}
              label="Sync Search"
              placeholder="Type to begin searching"
              onChange={handleSelect}
              description="With default display and search on focus"
              multiple={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
