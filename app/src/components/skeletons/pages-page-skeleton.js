import React from "react"

const SkeletonPagesList = ({}) => {
    return (
        <>
            <li className="skeleton-text">
                <a className="uk-link-heading uk-modal-close" href="#"></a>
            </li>
            <li className="skeleton-text">
                <a className="uk-link-heading uk-modal-close" href="#"></a>
            </li>
            <li className="skeleton-text">
                <a className="uk-link-heading uk-modal-close" href="#"></a>
            </li>
            <li className="skeleton-text">
                <a className="uk-link-heading uk-modal-close" href="#"></a>
            </li>
        </>
    )
}

export { SkeletonPagesList }