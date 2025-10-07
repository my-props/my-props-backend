const { getPool } = require('../config/database');

async function diagnoseViews() {
    console.log('🔍 Diagnosing Materialized Views Issues');
    console.log('='.repeat(50));

    try {
        const pool = await getPool();

        // Check if required tables exist
        console.log('\n📋 Checking required tables...');
        const tablesQuery = `
            SELECT 
                TABLE_NAME,
                'Table exists' as Status
            FROM INFORMATION_SCHEMA.TABLES 
            WHERE TABLE_NAME IN ('PlayerStats', 'Game', 'Player', 'Team', 'Season')
            ORDER BY TABLE_NAME
        `;

        const tablesResult = await pool.request().query(tablesQuery);
        console.log('Required tables:');
        tablesResult.recordset.forEach(table => {
            console.log(`  ✅ ${table.TABLE_NAME} - ${table.Status}`);
        });

        // Check if views exist
        console.log('\n📊 Checking materialized views...');
        const viewsQuery = `
            SELECT 
                TABLE_NAME as ViewName,
                'View exists' as Status
            FROM INFORMATION_SCHEMA.VIEWS
            WHERE TABLE_NAME IN (
                'PlayerVsTeamStats',
                'PlayerPositionStats', 
                'PlayerVsPositionStats',
                'PlayerVsPlayerStats'
            )
            ORDER BY TABLE_NAME
        `;

        const viewsResult = await pool.request().query(viewsQuery);
        console.log('Materialized views:');
        if (viewsResult.recordset.length === 0) {
            console.log('  ❌ No materialized views found');
        } else {
            viewsResult.recordset.forEach(view => {
                console.log(`  ✅ ${view.ViewName} - ${view.Status}`);
            });
        }

        // Check if procedures exist
        console.log('\n⚙️ Checking refresh procedures...');
        const proceduresQuery = `
            SELECT 
                ROUTINE_NAME as ProcedureName,
                'Procedure exists' as Status
            FROM INFORMATION_SCHEMA.ROUTINES
            WHERE ROUTINE_NAME IN (
                'RefreshAllMaterializedViews',
                'RefreshPlayerVsTeamStats',
                'RefreshPlayerPositionStats',
                'RefreshPlayerVsPositionStats',
                'RefreshPlayerVsPlayerStats'
            )
            ORDER BY ROUTINE_NAME
        `;

        const proceduresResult = await pool.request().query(proceduresQuery);
        console.log('Refresh procedures:');
        proceduresResult.recordset.forEach(proc => {
            console.log(`  ✅ ${proc.ProcedureName} - ${proc.Status}`);
        });

        // Check data availability
        console.log('\n📈 Checking data availability...');

        // Check PlayerStats data
        try {
            const playerStatsCount = await pool.request().query('SELECT COUNT(*) as Count FROM PlayerStats WHERE Active = 1');
            console.log(`  📊 PlayerStats records: ${playerStatsCount.recordset[0].Count}`);
        } catch (error) {
            console.log(`  ❌ PlayerStats table error: ${error.message}`);
        }

        // Check Game data
        try {
            const gameCount = await pool.request().query('SELECT COUNT(*) as Count FROM Game WHERE Active = 1');
            console.log(`  🎮 Game records: ${gameCount.recordset[0].Count}`);
        } catch (error) {
            console.log(`  ❌ Game table error: ${error.message}`);
        }

        // Check Player data
        try {
            const playerCount = await pool.request().query('SELECT COUNT(*) as Count FROM Player WHERE Active = 1');
            console.log(`  👤 Player records: ${playerCount.recordset[0].Count}`);
        } catch (error) {
            console.log(`  ❌ Player table error: ${error.message}`);
        }

        // Check Team data
        try {
            const teamCount = await pool.request().query('SELECT COUNT(*) as Count FROM Team WHERE Active = 1');
            console.log(`  🏀 Team records: ${teamCount.recordset[0].Count}`);
        } catch (error) {
            console.log(`  ❌ Team table error: ${error.message}`);
        }

        // Check Season data
        try {
            const seasonCount = await pool.request().query('SELECT COUNT(*) as Count FROM Season');
            console.log(`  📅 Season records: ${seasonCount.recordset[0].Count}`);
        } catch (error) {
            console.log(`  ❌ Season table error: ${error.message}`);
        }

        // Test individual view creation
        console.log('\n🧪 Testing individual view creation...');

        // Test PlayerVsTeamStats view
        try {
            console.log('  Testing PlayerVsTeamStats view...');
            const testQuery1 = `
                SELECT TOP 1 
                    PS.PlayerId,
                    P.FirstName,
                    P.LastName
                FROM PlayerStats PS
                INNER JOIN Game G ON PS.GameId = G.Id
                INNER JOIN Player P ON P.Id = PS.PlayerId
                WHERE PS.Active = 1 AND G.Active = 1 AND P.Active = 1
            `;
            const testResult1 = await pool.request().query(testQuery1);
            console.log(`    ✅ PlayerVsTeamStats query test passed (${testResult1.recordset.length} records)`);
        } catch (error) {
            console.log(`    ❌ PlayerVsTeamStats query test failed: ${error.message}`);
        }

        // Check ViewRefreshLog table
        console.log('\n📝 Checking ViewRefreshLog table...');
        try {
            const logQuery = `
                SELECT TOP 5 
                    ViewName,
                    Status,
                    ErrorMessage,
                    StartTime
                FROM ViewRefreshLog 
                ORDER BY StartTime DESC
            `;
            const logResult = await pool.request().query(logQuery);
            if (logResult.recordset.length > 0) {
                console.log('Recent refresh attempts:');
                logResult.recordset.forEach(log => {
                    console.log(`  📝 ${log.ViewName} - ${log.Status} - ${log.StartTime}`);
                    if (log.ErrorMessage) {
                        console.log(`    Error: ${log.ErrorMessage}`);
                    }
                });
            } else {
                console.log('  ℹ️ No refresh logs found');
            }
        } catch (error) {
            console.log(`  ❌ ViewRefreshLog table error: ${error.message}`);
        }

        console.log('\n🎯 Diagnosis complete!');
        console.log('\n💡 Next steps:');
        console.log('1. If tables are missing data, populate them first');
        console.log('2. If views don\'t exist, run the materialized_views.sql script');
        console.log('3. If procedures don\'t exist, run the refresh_procedures.sql script');
        console.log('4. Try running individual refresh procedures to isolate the issue');

    } catch (error) {
        console.error('❌ Diagnosis failed:', error.message);
        console.error('💡 Make sure your database connection is configured correctly');
    }
}

// Run the diagnosis
diagnoseViews()
    .then(() => {
        console.log('\n✨ Diagnosis script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Diagnosis script failed:', error);
        process.exit(1);
    });
