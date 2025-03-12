import mysql from 'mysql2/promise'

const config = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'knowledge_graph',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

console.log('Database config:', {
  ...config,
  password: config.password ? '[HIDDEN]' : '[EMPTY]'
})

const pool = mysql.createPool(config)

export async function query<T = unknown>(sql: string, values: unknown[] = []): Promise<T[]> {
  try {
    console.log('Executing SQL:', sql, 'with values:', values)
    // 根据错误信息，需要确保 T 类型满足 QueryResult 的约束
    // 这里我们可以通过类型断言来解决类型不匹配的问题
    const [rows] = await pool.execute(sql, values) as [T[], unknown];
    console.log('Query result:', rows)
    return rows
  } catch (error) {
    console.error('Database query error:', error)
    console.error('SQL:', sql)
    console.error('Values:', values)
    throw error
  }
}