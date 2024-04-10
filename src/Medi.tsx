import React, { useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";

type DataType = {
  doctor_name: string;
  pin_code: string;
};

const Container = styled.div`
  background: #252523;
  height: 100%;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;

  .content-container {
    display: flex;
    width: 70%;
    height: 75%;

    .content-left {
      color: #feca01;
      background: #2e312f;
      width: 60%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5%;

      .content-left-inner-wrapper {
        height: 100%;
        display: flex;
        align-items: center;

        .content-left-form {
          height: 60%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .doctor-name-container,
          .pincode-container {
            display: flex;
            flex-direction: column;
            height: 16%;
            justify-content: space-between;
          }

          .doctor-name-input-field,
          .pincode-input-field {
            :focus-visible {
              outline: none;
            }

            color: #feca01;
            background: transparent;
            border: none;
            border-bottom: 1px solid #feca01;
          }

          .city-name-and-loading-gif-container {
            height: 7%;
            .city-name-loading-gif-wrapper {
              height: 100%;
              display: flex;
              justify-content: center;
            }
          }

          .submit-button {
            border: 1px solid #f77a52;
            color: #f77a52;
            height: 40px;
            line-height: 40px;
            padding: 0px 40px 0px 15px;
            position: relative;
            overflow: hidden;
            transition: 0.4s all ease;
            background: transparent;

            .submit-button-loading-gif-wrapper {
              display: flex;
              justify-content: center;
              height: 100%;
            }

            :disabled {
              border-color: #a49a87;
            }

            :disabled:before {
              color: #a49a87;
            }

            :before {
              content: ">";
              position: absolute;
              right: 10px;
            }

            :hover {
              border-color: #a49a87;
            }

            :hover:before {
              color: #a49a87;
            }

            :hover span {
              top: -40px;
            }

            :hover span:after {
              opacity: 1;
            }

            span {
              position: relative;
              top: 0px;
              transition: 0.4s all ease;

              :after {
                content: attr(title);
                display: block;
                opacity: 0;
                transition: 0.4s all ease;
                color: #a49a87;
              }
            }
          }
        }
      }
    }

    .content-right {
      background: #dee2dd;
      width: 40%;
      height: 100%;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 0.5%;

      .doctor-detail-row {
        display: flex;
        justify-content: center;
        width: 100%;
        font-family: "Courier New", monospace;
        font-weight: bolder;
      }

      .white-bg {
        background: white;
      }

      .black-bg {
        background: #252523;
        color: white;
      }
    }
  }
  .table-header {
    display: flex;
  }

  .table-row {
    display: flex;
  }

  .table-column,
  .table-cell {
    border: 1px solid black;
  }

  .name-column {
    width: 80px;
  }
  .id-column {
    width: 40px;
  }
`;

export const Medi = () => {
  const [formData, setFormData] = useState<DataType>({
    doctor_name: "",
    pin_code: "",
  });
  const [doctorDetails, setDoctorDetails] = useState<DataType[]>([]);
  const [showCityNameLoadingGif, setShowCityNameLoadingGif] = useState(false);
  const [cityName, setCityname] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const getCityName = async (pin: string) => {
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/get_city_name`,
        {
          pin_code: pin,
        }
      );
      const city = result?.data?.city_name;
      setCityname(city);
      setShowCityNameLoadingGif(false);
    } catch (error) {
      setShowCityNameLoadingGif(false);
      setCityname("");
      console.error("Error getting city code:", error);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    isPin = false
  ) => {
    let updatedValue = { ...formData };
    if (isPin) {
      const value = e.target.value;
      const isEmptyOrIsNumber = value === "" || /^\d+$/.test(value);
      if (isEmptyOrIsNumber) {
        const valueTrimmed = value.trim();
        const valueLength = valueTrimmed.length;
        if (valueLength <= 6) {
          updatedValue = { ...updatedValue, pin_code: valueTrimmed };
          if (valueLength === 6) {
            setShowCityNameLoadingGif(true);
            void getCityName(valueTrimmed);
          } else {
            setCityname("");
          }
        }
      }
    } else {
      updatedValue = { ...updatedValue, doctor_name: e.target.value };
    }
    setFormData(updatedValue);
  };

  const handleSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
    setSubmitButtonDisabled(true);
    event?.preventDefault();
    try {
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/get_doctor_details`,
        { ...formData }
      );
      setDoctorDetails((result?.data?.data_set || []) as DataType[]);
      setSubmitButtonDisabled(false);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
      setSubmitButtonDisabled(false);
    }
  };

  return (
    <Container className="main-container">
      <div className="content-container">
        <div className="content-left">
          <div className="content-left-inner-wrapper">
            <form onSubmit={handleSubmit} className="content-left-form">
              <div className="doctor-name-container">
                <label>Doctor's Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.doctor_name}
                  onChange={(e) => handleChange(e)}
                  className="doctor-name-input-field"
                />
              </div>

              <div className="pincode-container">
                <label>Pincode</label>
                <input
                  name="pin"
                  value={formData.pin_code}
                  onChange={(e) => handleChange(e, true)}
                  required
                  className="pincode-input-field"
                />
              </div>

              <div className="city-name-and-loading-gif-container">
                {showCityNameLoadingGif ? (
                  <div className="city-name-loading-gif-wrapper">
                    <img
                      src={require("../src/images/city-name-loading.gif")}
                      alt="Loading city name"
                    />
                  </div>
                ) : (
                  <label>{cityName}</label>
                )}
              </div>

              <button className="submit-button" disabled={submitButtonDisabled}>
                {submitButtonDisabled ? (
                  <div className="submit-button-loading-gif-wrapper">
                    <img
                      src={require("../src/images/submit-button-loading.gif")}
                      alt="Loading"
                    />
                  </div>
                ) : (
                  <span title="Submit">Submit</span>
                )}
              </button>
            </form>
          </div>
        </div>
        <div className="content-right">
          {doctorDetails?.length !== 0 &&
            doctorDetails?.map((item, index) => (
              <div
                key={`${index}`}
                className={`doctor-detail-row ${
                  index % 2 === 0 ? "white-bg" : "black-bg"
                }`}
              >
                {item?.doctor_name}
              </div>
            ))}
        </div>
      </div>
    </Container>
  );
};
