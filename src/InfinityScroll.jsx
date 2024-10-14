// This part is intigrating infinityscroll by vanila js
const circle = document.getElementById("circle"); // target the elemet that observer observe

// create an instance of observer with js intersection observer API
const observer = new IntersectionObserver((items) => {
  const trackingInfo = items[0]; // item return an array of object and index 0 is the info about
  // targeted elemet, whether target element is in viewport or not
  // in the constructor we need to give a call back func that will be called when intersect

  if (trackingInfo.isIntersecting) {
    console.log("Circle is visible"); // here we can fetch data
    observer.disconnect(); // after first intersection we disconnect the observer
  } else {
    console.log("Circle is not visible");
  }
});

observer.observe(circle); // define what to observe

// intigrating infinityscroll by vanila js  end here

// here is the react version of the infinity scroll start

import { useEffect, useRef, useState } from "react";
import Product from "./Product";

const productsPerPage = 10;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true); // to check if are there more data
  const loaderRef = useRef(null); // instead of document.getElementById, we use ref in react

  useEffect(() => {
    // because intersection api and data need to work after rendering in dom , we use useEffect
    // to able to use infinity scroll backend must support pagination.
    const fetchProducts = async () => {
      const response = await fetch(
        `https://dummyjson.com/products?limit=${productsPerPage}&skip=${
          page * productsPerPage
        }`
      );
      const data = await response.json();

      if (data.products.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...data.products]);
        setPage((prevPage) => prevPage + 1);
      }
    };

    // this is a call back func that will be passed in constructor
    const onIntersection = (items) => {
      const loaderItem = items[0];

      if (loaderItem.isIntersecting && hasMore) {
        fetchProducts(); // this is the fetcher function
      }
    };
    // create intersection observer with constructor and give a call back
    const observer = new IntersectionObserver(onIntersection);

    if (observer && loaderRef.current) {
      observer.observe(loaderRef.current); // this line start observe the target
    }

    // cleanup
    return () => {
      if (observer) observer.disconnect();
    };
  }, [hasMore, page]);

  return (
    <div>
      <div>Product List</div>

      {products.map((product) => (
        <Product
          title={product.title}
          price={product.price}
          thumbnail={product.thumbnail}
          key={product.id}
        />
      ))}

      {hasMore && <div ref={loaderRef}>Loading more products...</div>}
    </div>
  );
}

// react version ends here

//  Que 1
// note:
// Yes, if a user scrolls to the bottom of the page and all products are fetched, all the fetched products will remain in the DOM.

// Here's how it works:

// State Management: The products state holds all the products that have been fetched. Each time new products are fetched (e.g., another batch of 10), they are added to this array using setProducts((prevProducts) => [...prevProducts, ...data.products]).

// Rendering: The component maps over the products array to render each Product component. As new products are added to the products state, the component re-renders, and all previously fetched products stay in the DOM along with the new ones.

// Final State: If the user continues to scroll and all available products are fetched, the final state of the products array will include all the fetched products. Therefore, all those products will be displayed in the DOM.

// In summary, once products are fetched and added to the state, they remain in the DOM even after the user scrolls to load more.

//  Que 2
// Yes, if a user continues to scroll and all fetched products remain in the DOM, it can lead to a heavy DOM. This can affect performance, particularly in terms of rendering speed and memory usage. Here are a few considerations:

// Rendering Performance: A large number of DOM elements can slow down rendering times, especially if each product component is complex.

// Memory Usage: Keeping a lot of elements in memory can increase the overall memory footprint of the application.

// Scrolling Performance: Smooth scrolling may be affected as the browser has to handle a larger number of elements.

// Strategies to Mitigate Heavy DOM
// To address these issues, you might consider implementing one or more of the following strategies:

// Virtualization: Use libraries like react-window or react-virtualized that only render the visible portion of the list. This way, the DOM only contains the elements currently in view, significantly improving performance.

// Pagination with Manual Load: Instead of loading all products automatically, allow users to click a button to load more products. This gives them control and can prevent overwhelming the DOM.

// Limit Total Fetches: Set a cap on the total number of products that can be loaded or shown at one time. You could provide a "Load More" button or stop fetching new data after a certain threshold.

// Lazy Loading Images: If products have images, implement lazy loading for images to improve initial load times.

// Que 3
// If you replace the state with only the newly fetched items, you'll lose the previously loaded data, which defeats the purpose of an infinite scrolling feature. Always append new data to maintain the full list of products.
