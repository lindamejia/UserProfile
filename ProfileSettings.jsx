import React, { Component } from "react";
import { Formik, Form, Field } from "formik";
import { Input } from "reactstrap";
import * as profileService from "../../services/profileService";
import SweetAlertWarning from "../ui/SweetAlertWarning";
import * as profileSchema from "./profileSchema";
import PropTypes from "prop-types";
import * as styles from "./profile.module.css";
// import { Modal } from "reactstrap";
import logger from "../../logger";

const _logger = logger.extend("ProfileSettings");

class ProfileSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      deleteProfile: false,
      deleteConfirm: false,
      countryCode: 1
    };
    this.state.initialValues = profileSchema.initialValues;
    this.state.validationSchema = profileSchema.validationSchema;
  }

  componentDidMount() {
    _logger(this.props);
    this.setState({ initialValues: this.props.user });
  }

  onSubmit = (values, { setSubmitting }) => {
    const id = this.props.user.id;
    _logger(values);
    profileService
      .editProfile(values, id)
      .then(this.onUpdateSuccess)
      .catch(this.onUpdateFail)
      .then(() => {
        setSubmitting(false);
      });
  };

  onDeleteProfile = () => {
    this.setState({
      deleteProfile: true
    });
  };

  onUpdateSuccess = () => {
    this.props.openSuccessAlert();
    this.props.getCurrentUser();
    // this.props.toggle();
    // this.props.passTheFunction();
  };

  onUpdateFail = error => {
    _logger(`Fail on update profile`, error);
    this.props.openErrorAlert();
  };

  okFunction = () => {
    // this.props.toggle();
    this.props.passTheFunction();
    this.setState({
      deleteProfile: false,
      showModal: false,
      deleteConfirm: false
    });
  };

  handleDelete = () => {
    const id = this.props.user.id;
    profileService
      .deleteProfile(id)
      .then(this.onDeleteSuccess)
      .catch(this.onDeleteError);
  };

  handleCancelProfile = () => {
    this.setState({
      deleteProfile: false
    });
  };

  onDeleteSuccess = res => {
    this.setState({ user: res.item, deleteConfirm: true });
    _logger(`You have successfully deleted Profile: ${res}`);
  };

  onDeleteError = error => {
    _logger(`Axios fail on delete Profile.`, error);
  };

  // handlePhoneNumberChange = e => {
  // 	this.setState({phoneNumber: e.keyCode})
  // }

  render() {
    const { validationSchema, initialValues } = this.state;

    return (
      <div className="col-lg-8 col-xlg-9 col-md-7">
        <div className="card-body">
          <Formik
            validationSchema={validationSchema}
            initialValues={initialValues}
            onSubmit={this.onSubmit}
            enableReinitialize={true}
            render={({ values, touched, errors, dirty, isSubmitting }) => (
              <Form className="form-horizontal form-material">
                <div className="row p-t-20">
                  <div className="form-group">
                    <label className="col-md-12">First Name</label>
                    <div className="col-md-12">
                      <Field
                        type="text"
                        name="firstName"
                        className="form-control"
                        value={values.firstName}
                      />
                      {errors.firstName && touched.firstName ? (
                        <div style={{ color: "red" }}>{errors.firstName} </div>
                      ) : null}
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="col-md-12">Last Name</label>
                    <div className="col-md-12">
                      <Field
                        type="text"
                        className="form-control"
                        name="lastName"
                        value={values.lastName}
                      />
                      {errors.lastName && touched.lastName ? (
                        <div style={{ color: "red" }}>{errors.lastName}</div>
                      ) : null}
                    </div>
                  </div>
                </div>
                <div className="form-group row">
                  <label className="col-md-12">Phone No</label>
                  <div className={`${styles.profilePhoneNumber}`}>
                    <span className={`${styles.phoneNumberCountryCode} mr-3`}>
                      +{this.state.countryCode}
                    </span>
                    <Input
                      tag={Field}
                      type="tel"
                      maxLength="12"
                      name="phoneNumber"
                      className="form-control"
                      value={values.phoneNumber}
                    />
                    {errors.phoneNumber && touched.phoneNumber ? (
                      <div style={{ color: "red" }}>{errors.phoneNumber}</div>
                    ) : null}
                  </div>
                </div>
                <div className="form-group">
                  <label className="col-md-12">Description</label>
                  <div className="col-md-12">
                    <Field
                      name="description"
                      type="text"
                      rows="5"
                      className="form-control"
                      value={values.description}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="col-sm-12">
                    <button
                      type="submit"
                      className="btn btn-success"
                      disabled={isSubmitting || !dirty}
                    >
                      Update Profile
                    </button>{" "}
                    <button
                      type="button"
                      className="btn btn-danger"
                      size="sm"
                      onClick={this.onDeleteProfile}
                    >
                      Delete Profile
                    </button>
                  </div>
                </div>
              </Form>
            )}
          />
        </div>
        {this.state.deleteProfile ? (
          <SweetAlertWarning
            confirmAction={this.handleDelete}
            cancelAction={this.handleCancelProfile}
            type="warning"
          />
        ) : null}
        {this.state.deleteConfirm && (
          <SweetAlertWarning
            title="Delete Successful"
            type="success"
            confirmAction={this.okFunction}
          />
        )}
      </div>
    );
  }
}

ProfileSettings.propTypes = {
  toggle: PropTypes.func,
  passTheFunction: PropTypes.func,
  user: PropTypes.object,
  id: PropTypes.number,
  getCurrentUser: PropTypes.func,
  openSuccessAlert: PropTypes.func,
  openErrorAlert: PropTypes.func
};

export default ProfileSettings;
