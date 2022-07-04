import React from "react";
import "./tags-container.css";

const hotdogNothotdog = (item) => {
    if (item.className === "hotdog, hot dog, red hot"){
        return (
            <h3 key={item.className}>Great Hotdog</h3>
        )
    } else {
        return (
            <h3 key={item.className}>Thats not a hotdog cheater</h3>
        )
    }
}

const TagsContainer = ({ predictions }) => (
  <div className="tags-container">
    {predictions.map(item => (
        hotdogNothotdog(item)
    ))}
   
  </div>
);

export default TagsContainer;
