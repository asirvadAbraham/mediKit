import React, { useState } from "react";
import axios from "axios";
import styled from "@emotion/styled";

type DataType = {
  name: string;
  pinCode: string;
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

          .city-name-container {
            height: 7%;
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
    name: "",
    pinCode: "",
  });
  const [resultantData, setResultantData] = useState<DataType[]>([]);
  const [cityName, setCityname] = useState("");

  const getCityName = async (pin: string) => {
    try {
      const result = await axios.post(
        `https://asirvad.pythonanywhere.com/get_city_name`,
        {
          pin_code: pin,
        }
      );
      const city = result?.data?.city_name;
      setCityname(city);
    } catch (error) {
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
          updatedValue = { ...updatedValue, pinCode: valueTrimmed };
          if (valueLength === 6) {
            void getCityName(valueTrimmed);
          } else {
            setCityname("");
          }
        }
      }
    } else {
      updatedValue = { ...updatedValue, name: e.target.value };
    }
    setFormData(updatedValue);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await axios.post(
        "http://localhost:5000/submit_data",
        formData
      );
      setResultantData(result.data as DataType[]);
    } catch (error) {
      console.error("Error submitting data:", error);
      alert("Error submitting data. Please try again.");
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
                  value={formData.name}
                  onChange={(e) => handleChange(e)}
                  className="doctor-name-input-field"
                />
              </div>

              <div className="pincode-container">
                <label>Pincode</label>
                <input
                  name="pin"
                  value={formData.pinCode}
                  onChange={(e) => handleChange(e, true)}
                  required
                  className="pincode-input-field"
                />
              </div>

              <div className="city-name-container">
                <label>{cityName}</label>
              </div>

              <a href="/#" className="submit-button">
                <span title="Submit">Submit</span>
              </a>
            </form>
          </div>
        </div>
        <div className="content-right"></div>
      </div>
    </Container>
  );
};
