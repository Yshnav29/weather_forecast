import React from 'react'
import search from '../images/magnifying-glass.png'
import cloudy from '../images/partly-cloudy.png'
import { useEffect,useState } from 'react'
import axios, { Axios } from 'axios'
import '../css/responsive.css'



export default function Home() {

    const today = new Date();
    const monthName = ['Janurary','February','March','April','May','June','July','August','Septemper','October','November','December'];
    const yyyy = today.getFullYear();

    const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    const [weatherdata,setWeatherdata] = useState({});
    const [flag,setFlag] = useState(0);
    const [cityName,setCityName] = useState('');
    const [tempCity,setTempCity] = useState('');

    useEffect(() => {
        async function getdata() {
            const weather_api_key = process.env.REACT_APP_WEATHER_API_KEY;

            try {
                let response =  await axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${weather_api_key}&units=metric`);
                console.log("new data: ",response.data);
                setWeatherdata(response.data);

            }catch(err) {
                console.log(err);
            }
        }
        getdata();
    },[cityName]);

    useEffect(() => {
        const city_api_key = process.env.REACT_APP_CITY_API_KEY;

        async function getCityName() {
            const res_city = await axios.get(`https://api.ipdata.co?api-key=${city_api_key}`);
            const city = res_city.data.city;

            console.log(city);
            setCityName(city);
        }
        if(city_api_key) {
            getCityName()
            console.log("api key success");
        }

    },[]);

    if(cityName) {
        console.log("city: ",cityName);
    }

    function unixToDate(unix_ts) {
        let unix_date = new Date(unix_ts * 1000);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
        return unix_date.toLocaleDateString('en-US',options);
    }

    function stdToLocalDate(std) {
        let unix_date = new Date(std);
        const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        }
        return unix_date.toLocaleDateString('en-US',options); //dd/mm/yyyy
    }

    function requestedDate() {
        let cd;
        if (flag === 0) {
            cd = today;
        }
        else if(flag === 1) {
            cd = new Date(today.getTime() + (1000 * 60 * 60 * 24));// to add days
        }
        else if(flag === 2) {
            cd = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 2));
        }
        else if(flag === 3) {
            cd = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 3));
        }
        else if(flag === 4) {
            cd = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 4));
        }

        if(weatherdata.list) {
            let display_data = weatherdata.list.map(element => {
                let unix_date = unixToDate(element.dt);
                 if(stdToLocalDate(cd) === unix_date) {
                    return element;
                 }
            }).filter(element => element !== undefined);
            let temp_arr;
            if(display_data.length % 2 === 0) {
                temp_arr = display_data[display_data.length / 2];
            }
            else if(display_data % 2 !== 0) {
                temp_arr = display_data[(display_data.length - 1) / 2];
            }
            return temp_arr; // array of objects which have the requested date
        }
    }
    const final_data = requestedDate();
    console.log(final_data);
   

    function addTwoDay() {
        let cd = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 2));
        cd = days[cd.getDay()];
        return cd; 
    }
    function addThreeDay() {
        let cd = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 3));
        cd = days[cd.getDay()];
        return cd; 
    }
    function addFourDay() {
        let cd = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 4));
        cd = days[cd.getDay()];
        return cd; 
    }


    function direction(degree) {
        var dir;
        if (degree >= 0 && degree <= 359) {
          if (degree <= 89) {
            dir = 'North';
          } else if (degree <= 179) {
            dir = 'East';
          } else if (degree <= 269) {
            dir = 'South';
          } else {
            dir = 'West';
          }
        } else {
          dir = 'Invalid Degree';
        }
        return dir;
    }

    function handleDate() {
        let date;
        if (flag === 0) {
            date = today;
        }
        else if(flag === 1) {
            date = new Date(today.getTime() + (1000 * 60 * 60 * 24));// to add days
        }
        else if(flag === 2) {
            date = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 2));
        }
        else if(flag === 3) {
            date = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 3));
        }
        else if(flag === 4) {
            date = new Date(today.getTime() + (1000 * 60 * 60 * 24 * 4));
        }
        let month = monthName[date.getMonth()];
        let zd = String(date.getDate()).padStart(2,'0');
        let new_date = zd + '-' + month + '-' + yyyy;
        return new_date;
    }

    function displayDay() {
        let req_day = new Date(handleDate());
        let day = days[req_day.getDay()];
        return day;
    }


  return (
    <div>
        <div style={styles.wrapper}>
            <div style={styles.leftdiv}>
                <form style={styles.form}>
                    <input style={styles.searchinput} placeholder='search places' onChange={(event) => setTempCity(event.target.value)} />
                    <button style={styles.searchbtn} type='button' onClick={() => setCityName(tempCity)} ><img style={styles.image} src={search} /></button>
                </form>
                <img style={styles.cloud} src={cloudy} />
                {final_data && <h1 style={styles.maintemp}>{final_data.main.feels_like} &deg;C</h1>}
                {final_data && <h2 style={styles.description}>{final_data.weather[0].description}</h2>}
                <div style={styles.leftdivborder}></div>
                <h3>{handleDate()}</h3>
                <h3>{displayDay()}</h3>
                {cityName && <h2>{cityName}</h2>}
            </div>
            
            <div style={styles.rightdiv}>
                <ul style={styles.list}>
                    <li className='days' style={styles.li} onClick={() => setFlag(0)}>Today</li>
                    <li className='days' style={styles.li} onClick={() => setFlag(1)}>Tomorrow</li>
                    <li className='days' style={styles.li} onClick={() => setFlag(2)}>{addTwoDay()}</li>
                    <li className='days' style={styles.li} onClick={() => setFlag(3)}>{addThreeDay()}</li>
                    <li className='days' style={styles.li} onClick={() => setFlag(4)}>{addFourDay()}</li>
                </ul>
                <div style={styles.featurewrapper}>
                    <div style={styles.feature} >
                        <h3 style={styles.featurehead}>Wind</h3>
                        {final_data && <h2 style={styles.featuredata}>{final_data.wind.speed}km/h</h2>}
                        {final_data && <h3 style={styles.featurehead}>{direction(final_data.wind.deg)}</h3>}
                    </div>
                    <div style={styles.feature} >
                        <h3 style={styles.featurehead}>Humidity</h3>
                        {final_data && <h2 style={styles.featuredata}>{final_data.main.humidity}%</h2>}
                    </div>
                    <div style={styles.feature} >
                        <h3 style={styles.featurehead}>Real Feel</h3>
                        {final_data && <h2 style={styles.featuredata}>{final_data.main.feels_like} &deg;C</h2>}
                    </div>
                    <div style={styles.feature} >
                        <h3 style={styles.featurehead}>Pressure</h3>
                        {final_data && <h2 style={styles.featuredata}>{final_data.main.pressure} mb</h2>}
                    </div>
                    <div style={styles.feature} >
                        <h3 style={styles.featurehead}>Sky</h3>
                        {final_data && <h2 style={styles.featuredata}>{final_data.weather[0].description}</h2>}
                    </div>
                    <div style={styles.feature} >
                        <h3 style={styles.featurehead}>Min. Temp.</h3>
                        {final_data && <h2 style={styles.featuredata}>{final_data.main.temp_min} &deg;C</h2>}
                    </div>
                    <div style={styles.feature} >
                        <h3 style={styles.featurehead}>Max. Temp.</h3>
                        {final_data && <h2 style={styles.featuredata}>{final_data.main.temp_max} &deg;C</h2>}
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}


const styles = {
    wrapper : {
        display: "flex",
        flexDirection: "row",
        height: "100vh",
    },
    leftdiv : {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "30%",
        justifyContent: "space-around"
    },
    form : {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        borderRadius: "16px",
        alignItems: "center",
        width: "16em",
        padding: "4px 5px",
        marginTop: "1em",
        backgroundColor: "#e0e0e0"
    },
    searchinput: {
        border: "none",
        padding: "4px 6px",
        outline: "none",
        backgroundColor: "#e0e0e0"
    },
    searchbtn : {
        backgroundColor: "#fff",
        border: "none",
        width: "fit-content",
        padding: "0",
        height: "fit-content",
        backgroundColor: "#e0e0e0",
        cursor: "pointer"
    },
    image : {
        width: "1.5em"
    },
    cloud : {
        width: "12em"
    },
    maintemp : {
        fontWeight: "normal",
        fontSize: "4rem",
        margin: "0"
    },
    description : {
        fontWeight: "normal",
        fontSize: "1.125rem",
        marginTop: "0"
    },
    leftdivborder: {
        border: "2px solid #ededed",
        width: "60%"
    },
    rightdiv : {
        backgroundColor: "#e0e0e0",
        width: "70%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around"
    },
    list : {
        display: "flex",
        flexDirection: "row",
        listStyle: "none",
        justifyContent: "space-around",
        margin: "0",
        padding: "0",
        width: "90%",
        height: "3em",
        alignItems: "center"
    },
    li : {
        fontSize: "1.5rem",
        color: "#878787",
        cursor: "pointer"
    },
    featurewrapper : {
        display: "grid",
        gridTemplateColumns: "15em 15em 15em",
        gap: "5em"
    },
    feature : {
        height: "9em",
        backgroundColor: "#8290fa",
        borderRadius: "20px",
        color: "#fff",
    },
    featurehead: {
        fontSize: "1rem",
        fontWeight: "normal",
        width: "40%",
        textAlign: "center",
        color: "#e0e0e0",
    },
    featuredata: {
        fontSize: "1.75rem",
        fontWeight: "lighter",
        width: "70%",
        textAlign: "center",
        margin: "0"
    }
}