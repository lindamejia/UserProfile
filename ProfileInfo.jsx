import React, { Component } from "react";
import PropTypes, { oneOfType } from "prop-types";

class ProfileInfo extends Component {

  componentDidMount(){
    console.log(this.props)
  }
  render() {
    return (
      <React.Fragment>
        <div className="tab-pane" id="profile" role="tabpanel">
          <div className="card-body">
            <div className="row">
              <div className="col-md-3 col-xs-6 b-r">
                {" "}
                <strong>Full Name</strong>
                <br />
                <p className="text-muted">
                  <span>{this.props.user.firstName}</span>
                  <span> {this.props.user.lastName}</span>
                </p>
              </div>
              <div className="col-md-3 col-xs-6 b-r">
                {" "}
                <strong>Mobile</strong>
                <br />
                <p className="text-muted">{this.props.user.phoneNumber}</p>
              </div>
              <div className="col-md-3 col-xs-6 b-r">
                {" "}
                <strong>Email</strong>
                <br />
                <p className="text-muted">{this.props.user.email}</p>
              </div>
              <div className="col-md-3 col-xs-6">
                {" "}
                <strong>Location</strong>
                <br />
                <p className="text-muted">
                  {this.props.address
                    ? `${this.props.address.lineOne}${
                        this.props.address.lineTwo === ""
                          ? ", "
                          : this.props.address.lineTwo + ", "
                      } ${this.props.address.zip}, ${this.props.address.city}`
                    : "No Address"}{" "}
                </p>
              </div>
            </div>
            <hr />

            {/* this thing starts here */}

            <div>
              <h4 className="font-medium m-t-30">
                Influencer: {this.props.influencer}
              </h4>
              <hr />
              <h5 className="m-t-30">
                Followers<span className="pull-right">80%</span>
              </h5>
              <div className="progress">
                <div
                  className="progress-bar bg-success"
                  role="progressbar"
                  aria-valuenow="80"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  // style={"width:80% height:6px"}
                >
                  {" "}
                  <span className="sr-only">50% Complete</span>{" "}
                </div>
              </div>
              <h5 className="m-t-30">
                Milestone ID <span className="pull-right">90%</span>
              </h5>
              <div className="progress">
                <div
                  className="progress-bar bg-info"
                  role="progressbar"
                  aria-valuenow="90"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  // style="width:90%; height:6px;"
                >
                  {" "}
                  <span className="sr-only">50% Complete</span>{" "}
                </div>
              </div>
            </div>

            {/* this thing ends here */}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

ProfileInfo.propTypes = {
  user: PropTypes.shape({
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    phoneNumber: PropTypes.string.isRequired
  }),
  influencer: oneOfType([PropTypes.object, PropTypes.string]),
  address: PropTypes.object
};
export default ProfileInfo;
