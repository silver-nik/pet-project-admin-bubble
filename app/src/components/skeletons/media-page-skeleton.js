import React from "react"

const SkeletonMediaTabs = ({}) => {
    return (
        <ul className="content-container">
            <li className="folder-item skeleton-tab">
            </li>
            <li className="folder-item skeleton-tab">
            </li>
            <li className="folder-item skeleton-tab">
            </li>
            <li className="folder-item skeleton-tab">
            </li>
            <li className="folder-item skeleton-tab">
            </li>
            <li className="folder-item skeleton-tab">
            </li>
            <li className="folder-item skeleton-tab">
            </li>
            <li className="folder-item skeleton-tab">
            </li>
        </ul>
    )
}

const SkeletonMediaImg = () => {
    return (
        <ul className="content-container__files">
            <li className="folder-item skeleton-img">
            </li>
            <li className="folder-item skeleton-img">
            </li>
            <li className="folder-item skeleton-img">
            </li>
            <li className="folder-item skeleton-img">
            </li>
            <li className="folder-item skeleton-img">
            </li>
            <li className="folder-item skeleton-img">
            </li>
            <li className="folder-item skeleton-img">
            </li>
            <li className="folder-item skeleton-img">
            </li>
        </ul>
    )
}

export { SkeletonMediaTabs, SkeletonMediaImg };