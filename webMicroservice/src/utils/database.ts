import mysql from 'mysql2/promise';

export async function query({query, values = []}: {query: any, values?: any[]}) {

  const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root1234',
    database: 'usersWeb',
    port: 3306,
  });

  try {
    const [results] = await connection.execute(query, values);
    connection.end();
    return results;
  } catch (error) {
    throw error;
  }
}


