import React from "react";
export default function Page() {
  return (
    <div>
      <h1>Hello Performance Reports!</h1>
      <p>This is a dummy page with a lot of content to test scrolling.</p>

      {/* Large Dummy Content for Scrolling */}
      <div style={{ padding: "16px", background: "#fff" }}>
        {[...Array(50)].map((_, index) => (
          <p key={index}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            tincidunt, nunc ac tincidunt suscipit, elit felis malesuada odio,
            non pellentesque nisl odio ut nisi. Phasellus ut lectus vitae felis
            tempor consequat at id magna.
          </p>
        ))}
      </div>
    </div>
  );
}
