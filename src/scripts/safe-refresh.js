const { getPool } = require('../config/database');

async function safeRefreshViews() {
    console.log('🛡️ Safe Materialized Views Refresh');
    console.log('='.repeat(50));

    try {
        const pool = await getPool();

        console.log('🔌 Testing database connection...');
        await pool.request().query('SELECT 1 as test');
        console.log('✅ Database connection successful!');

        // Test each view individually with error handling
        const views = [
            'PlayerVsTeamStats',
            'PlayerPositionStats',
            'PlayerVsPositionStats',
            'PlayerVsPlayerStats'
        ];

        for (const viewName of views) {
            console.log(`\n🔄 Testing ${viewName}...`);

            try {
                // Try to refresh the individual view
                const result = await pool.request().execute(`Refresh${viewName}`);
                console.log(`✅ ${viewName} refreshed successfully`);
            } catch (error) {
                console.log(`❌ ${viewName} failed: ${error.message}`);

                // Try to identify the specific issue
                if (error.message.includes('Invalid object name')) {
                    console.log(`  💡 Issue: Table or view doesn't exist`);
                } else if (error.message.includes('Invalid column name')) {
                    console.log(`  💡 Issue: Column doesn't exist in referenced table`);
                } else if (error.message.includes('Arithmetic overflow')) {
                    console.log(`  💡 Issue: Data type conversion error`);
                } else if (error.message.includes('The multi-part identifier')) {
                    console.log(`  💡 Issue: Table join or reference problem`);
                } else {
                    console.log(`  💡 Issue: ${error.message}`);
                }
            }
        }

        console.log('\n🎯 Safe refresh completed!');
        console.log('💡 Check the results above to identify which views are failing');

    } catch (error) {
        console.error('❌ Safe refresh failed:', error.message);
        console.error('💡 Make sure your database connection is configured correctly');
    }
}

// Run the safe refresh
safeRefreshViews()
    .then(() => {
        console.log('\n✨ Safe refresh script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Safe refresh script failed:', error);
        process.exit(1);
    });
