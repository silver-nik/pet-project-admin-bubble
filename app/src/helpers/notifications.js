import React, {Component} from "react";
import UIkit from "uikit";

const showNotifications = ({message, status, pos = 'bottom-center'}) => {
    UIkit.notification({message, status, pos});
}

export default showNotifications;
