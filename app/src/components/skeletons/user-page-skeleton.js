import React from "react"

const SkeletonUsersList = ({}) => {
    return (
        <>
            <li className="d-flex align-items-center py-3 border-bottom user-item">
                <div className="img-sm rounded-circle skeleton-rounded-img"></div>
                <div className="ms-3 user-info">
                    <h6 className="mb-1 skeleton-text"></h6>
                    <h6 className="mb-1 text-muted skeleton-text"></h6>
                    <small className="text-muted mb-0 country skeleton-text"></small>
                </div>
                <span uk-icon="chevron-right" className="arrow-right"></span>
            </li>
            <li className="d-flex align-items-center py-3 border-bottom user-item">
                <div className="img-sm rounded-circle  skeleton-rounded-img"></div>
                <div className="ms-3 user-info">
                    <h6 className="mb-1 skeleton-text"></h6>
                    <h6 className="mb-1 text-muted skeleton-text"></h6>
                    <small className="text-muted mb-0 country skeleton-text"></small>
                </div>
                <span uk-icon="chevron-right" className="arrow-right"></span>
            </li>
            <li className="d-flex align-items-center py-3 border-bottom user-item">
                <div className="img-sm rounded-circle  skeleton-rounded-img"></div>
                <div className="ms-3 user-info">
                    <h6 className="mb-1 skeleton-text"></h6>
                    <h6 className="mb-1 text-muted skeleton-text"></h6>
                    <small className="text-muted mb-0 country skeleton-text"></small>
                </div>
                <span uk-icon="chevron-right" className="arrow-right"></span>
            </li>
            <li className="d-flex align-items-center py-3 border-bottom user-item">
                <div className="img-sm rounded-circle  skeleton-rounded-img"></div>
                <div className="ms-3 user-info">
                    <h6 className="mb-1 skeleton-text"></h6>
                    <h6 className="mb-1 text-muted skeleton-text"></h6>
                    <small className="text-muted mb-0 country skeleton-text"></small>
                </div>
                <span uk-icon="chevron-right" className="arrow-right"></span>
            </li>
        </>
    )
}

export { SkeletonUsersList }