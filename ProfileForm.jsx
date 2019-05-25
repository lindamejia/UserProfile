import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "reactstrap";
import * as profileService from "../../services/profileService";
import { initialValues, validationSchema } from "./profileSchema";
import PropTypes from "prop-types";
import { Modal } from "reactstrap";
import FileCropUpload from "../fileUpload/FileCropUpload";
import SweetAlert from "react-bootstrap-sweetalert";
import logger from "../../logger";
import * as styles from "./profile.module.css";

const _logger = logger.extend("DashboardProfile");

class ProfileForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      sweetAlert: false,
      avatarUrl: ""
    };
    this.state.initialValues = initialValues;
  }

  handleSubmit = (values, { setSubmitting }) => {
    _logger(values);
    this.setState({ values });
    const profileInput = {
      ...values,
      avatarUrl: this.state.avatarUrl
    };

    profileService
      .createProfile(profileInput)
      .then(() => {
        setSubmitting(false);
      })
      .then(this.onCreateSuccess)
      .catch(this.onCreateFail);
    console.log("Submitted values:", profileInput);
  };

  uploadAvatarUrl = imgUrl => {
    _logger(`change Avatar`, imgUrl);
    this.setState({ avatarUrl: imgUrl });
  };

  toggle = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  onCreateSuccess = data => {
    console.log(`Success POST new Profile`, data);
    this.setState({ sweetAlert: true });
    setTimeout(() => {
      this.props.displayCurrentUser();
    }, 3000);
  };

  onCreateFail = error => {
    console.log(`something went wrong with creating a new profile`, error);
  };

  setSweetAlert = () => {
    this.setState({ sweetAlert: false });
  };

  render() {
    return (
      <React.Fragment>
        <div className="row">
          <div className="col-lg-12">
            <div className="card card-outline-info">
              <div className="card-header">
                <h4 className="m-b-0 text-white">Profile</h4>
              </div>
              <div className="card-body">
                <Formik
                  validationSchema={validationSchema}
                  initialValues={initialValues}
                  onSubmit={this.handleSubmit}
                  enableReinitialize={true}
                  render={({
                    values,
                    touched,
                    errors,
                    dirty,
                    isSubmitting
                  }) => (
                    <Form>
                      <div className="form-body">
                        <h3 className="card-title">Person Info</h3>
                        <hr />
                        <div className="row p-t-20">
                          <div className="col-md-6">
                            <div className="form-group">
                              First Name: *
                              <br />
                              <Field
                                type="text"
                                component="input"
                                name="firstName"
                                placeholder="First Name"
                                className="form-control"
                                value={values.firstName}
                              />
                              {errors.firstName && touched.firstName ? (
                                <div style={{ color: "red" }}>
                                  {errors.firstName}{" "}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              Last Name: * <br />
                              <Field
                                type="text"
                                component="input"
                                name="lastName"
                                placeholder="Last Name"
                                className="form-control"
                                value={values.lastName}
                              />
                              {errors.lastName && touched.lastName ? (
                                <div style={{ color: "red" }}>
                                  {errors.lastName}
                                </div>
                              ) : null}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              Date of Birth: <br />
                              <Field
                                type="datetime"
                                component="input"
                                name="dob"
                                placeholder="MM/DD/YYYY"
                                className="form-control"
                                value={values.dob}
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              Phone Number:{" "}
                              <small>
                                Please enter country code and NO special
                                characters
                              </small>{" "}
                              <br />
                              <Input
                                tag={Field}
                                type="tel"
                                maxLength="12"
                                name="phoneNumber"
                                className="form-control"
                                placeholder="123456789"
                                value={values.phoneNumber}
                              />
                              {errors.phoneNumber && touched.phoneNumber ? (
                                <div style={{ color: "red" }}>
                                  {errors.phoneNumber}
                                </div>
                              ) : null}
                            </div>
                          </div>
                          <div className="col-6">
                            <div className="form-group">
                              Profile Picture:
                              <br />
                              <label className="btn btn-info">
                                Change Profile Picture
                                <FileCropUpload
                                  returnImg={this.uploadAvatarUrl}
                                />
                              </label>
                              {this.state.avatarUrl ? (
                                <div className={styles.image}>
                                  <img
                                    className="productPicture"
                                    width="100%"
                                    height="100%"
                                    src={this.state.avatarUrl}
                                    alt=""
                                    title={this.state.avatarUrl}
                                  />
                                </div>
                              ) : (
                                <div className={styles.image}>
                                  <img
                                    className="productPicture"
                                    width="100%"
                                    src="https://sabio-boocamp-api.s3-us-west-2.amazonaws.com/4d914966-764e-4a00-93c6-0ac32abe178a_placeholder-image.jpg"
                                    alt=""
                                    title="placeholder"
                                  />
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              Description: <br />
                              <Field
                                type="text"
                                name="description"
                                placeholder="Description"
                                className="form-control"
                                component="textarea"
                                value={values.description}
                              />
                            </div>
                          </div>
                          <div className="col-md-6">
                            <div className="form-group">
                              <button
                                type="submit"
                                className="btn btn-success"
                                disabled={isSubmitting || !dirty}
                                // onClick={() =>
                                //   validateForm().then(res =>
                                //     this.validateForm(res)
                                //   )
                                // }
                              >
                                Submit
                              </button>
                            </div>
                            {this.state.sweetAlert && (
                              <SweetAlert
                                success
                                title="Your profile has been created!"
                                onConfirm={this.setSweetAlert}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </Form>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
        <Modal
          isOpen={this.state.showModal}
          modalTransition={{ timeout: 700 }}
          backdropTransition={{ timeout: 1300 }}
          toggle={this.toggle}
        />
      </React.Fragment>
    );
  }
}

ProfileForm.propTypes = {
  displayCurrentUser: PropTypes.func,
  getMainImageUrl: PropTypes.func
};

export default ProfileForm;
