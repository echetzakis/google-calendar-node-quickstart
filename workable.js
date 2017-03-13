const pg = require('pg');
// FIXME: Has to be ENV variable
const connectionString = 'postgres://localhost:5432/workable_development';
const client = new pg.Client(connectionString);

var getAuthIdentity = function (memberId, callback) {
    // Get a Postgres client from the connection pool
    pg.connect(connectionString, (err, client, done) => {
        const results = [];
        // Handle connection errors
        if (err) {
            done();
            console.log(err);
            callback(err, results);
        } else {
            // SQL Query > Insert Data
            const query = client.query('\
            select m.id,ai.email, ai.auth_token, ai.refresh_token, ai.expires_at \
            from auth_identities ai \
            inner join users u on u.id = ai.user_id \
            inner join members m on m.user_id = u.id \
            where ai.provider=\'google\' and m.id=$1;', [memberId]);
            // Stream results back one row at a time
            query.on('row', (row) => {
                results.push(row);
            });
            // After all data is returned, close connection and return results
            query.on('end', () => {
                done();
                callback(null, results);
            });
        }
    });
}

exports.getAuthIdentity = getAuthIdentity;