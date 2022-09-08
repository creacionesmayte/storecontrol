import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./AreYouSure.scss";

function AreYouSure() {
    return (
        <div className="areyousure">
            <div
                className="modal fade"
                id="areyousure"
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div
                    className="modal-dialog modal-dialog-centered"
                    role="document"
                >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Refund
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">
                                    <FontAwesomeIcon icon="close" />
                                </span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <span className="text-font">
                                Are you Sure, You want to Refund?
                            </span>
                        </div>
                        <div className="modal-footer">
                            <div className="container-fluid m-0">
                                <div className="row">
                                    <div className="col p-0">
                                        <button
                                            type="button"
                                            className="btn btn-danger"
                                            data-dismiss="modal"
                                        >
                                            No
                                        </button>
                                    </div>
                                    <div className="col p-0">
                                        <button
                                            type="button"
                                            className="btn btn-success"
                                            data-dismiss="modal"
                                        >
                                            Yes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AreYouSure;
