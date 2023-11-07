import mysql from "mysql2/promise";
console.log(process.env.MYSQL_USER);

const conn = await mysql.createConnection({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  multipleStatements: true,
});

console.log("====== init physical stores ======");

const stores = [
  {
    name: "台北車站館前店",
    lat: "25.045749558028554",
    lng: "121.51477021384437",
    address: "台北市中正區館前路12號",
    phone: "(02)2331-5806",
    open_time: "11:00",
    close_time: "22:00",
    stock: 5,
  },
  {
    name: "西門店",
    lat: "25.044023639710836",
    lng: "121.50711269664501",
    address: "台北市萬華區漢中街52號",
    phone: "(02)2331-4828",
    open_time: "11:00",
    close_time: "11:00",
  },
  {
    name: "Global Mall  新北中和店",
    lat: "25.006886285840675",
    lng: "121.47485399849825",
    address: "新北市中和區中山路三段122號",
    phone: "(02)3234-7604",
    open_time: "11:00",
    close_time: "22:00",
  },
  {
    name: "中壢中華路店",
    lat: "24.96886585202906",
    lng: "121.2493434678071",
    address: "桃園市中壢區中華路一段699號",
    phone: "(03)461-2137",
    open_time: "11:00",
    close_time: "22:00",
  },
  {
    name: "皮卡丘旗艦店",
    lat: "25.02143530092362",
    lng: "121.55607186631653",
    address: "台北市信義區和平東路三段319號",
    phone: "(03)2331-0857",
    open_time: "09:00",
    close_time: "09:30",
  },
];

try {
  conn.query("BEGIN");
  const results = await conn.query(
    `
    INSERT INTO stores (
      name, lat, lng, address, phone, open_time, close_time
    )
    VALUES ?
  `,
    [
      stores.map((store) => {
        const { name, lat, lng, address, phone, open_time, close_time } = store;
        return [name, lat, lng, address, phone, open_time, close_time];
      }),
    ]
  );
  conn.query("COMMIT");
  console.log("====== results ======", results);
} catch (err) {
  console.error(err);
  conn.query("ROLLBACK");
} finally {
  conn.end();
}

process.exit();
