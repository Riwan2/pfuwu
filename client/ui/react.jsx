import React from "react";
import ReactDOM from "react-dom";
import { ChatComponent } from "./chat/chat";

ReactDOM.render(
    <React.StrictMode>
        <ChatComponent />
    </React.StrictMode>,
    document.getElementById('root'),
);

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://www.snowpack.dev/concepts/hot-module-replacement
if (undefined /* [snowpack] import.meta.hot */ ) {
    undefined /* [snowpack] import.meta.hot */ .accept();
}
