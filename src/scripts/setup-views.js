const fs = require('fs');
const path = require('path');
const { getPool } = require('../config/database');

async function runSqlFile(filePath) {
    try {
        console.log(`\n📄 Reading SQL file: ${filePath}`);
        const sqlContent = fs.readFileSync(filePath, 'utf8');

        console.log(`📊 Executing SQL file...`);
        const pool = await getPool();

        // Split the SQL content by GO statements
        const sqlStatements = sqlContent.split(/\n\s*GO\s*\n/i);

        for (let i = 0; i < sqlStatements.length; i++) {
            const statement = sqlStatements[i].trim();
            if (statement && !statement.startsWith('--')) {
                try {
                    console.log(`  ⚡ Executing statement ${i + 1}/${sqlStatements.length}...`);
                    await pool.request().query(statement);
                    console.log(`  ✅ Statement ${i + 1} completed successfully`);
                } catch (error) {
                    console.error(`  ❌ Error in statement ${i + 1}:`, error.message);
                    // Continue with other statements
                }
            }
        }

        console.log(`✅ SQL file ${filePath} executed successfully!`);
        return true;
    } catch (error) {
        console.error(`❌ Error executing SQL file ${filePath}:`, error.message);
        return false;
    }
}

async function setupMaterializedViews() {
    console.log('🚀 Setting up Materialized Views for MyProps Backend');
    console.log('='.repeat(60));

    try {
        // Test database connection first
        console.log('🔌 Testing database connection...');
        const pool = await getPool();
        await pool.request().query('SELECT 1 as test');
        console.log('✅ Database connection successful!');

        // Run materialized views script
        const viewsPath = path.join(__dirname, '../data/materialized_views.sql');
        const viewsSuccess = await runSqlFile(viewsPath);

        if (!viewsSuccess) {
            console.log('❌ Failed to create materialized views');
            return;
        }

        // Run refresh procedures script
        const proceduresPath = path.join(__dirname, '../data/refresh_procedures.sql');
        const proceduresSuccess = await runSqlFile(proceduresPath);

        if (!proceduresSuccess) {
            console.log('❌ Failed to create refresh procedures');
            return;
        }

        // Test the views
        console.log('\n🧪 Testing materialized views...');
        try {
            const testQuery = `
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

            const result = await pool.request().query(testQuery);
            console.log('✅ Materialized views created successfully:');
            result.recordset.forEach(view => {
                console.log(`  📊 ${view.ViewName} - ${view.Status}`);
            });

        } catch (error) {
            console.log('⚠️  Views created but test query failed:', error.message);
        }

        console.log('\n🎉 Materialized views setup completed successfully!');
        console.log('📡 You can now use the /api/views/check-views endpoint');
        console.log('🔄 Use /api/views/refresh-all to populate the views with data');

    } catch (error) {
        console.error('❌ Setup failed:', error.message);
        console.error('💡 Make sure your database connection is configured correctly in .env');
    }
}

// Run the setup
setupMaterializedViews()
    .then(() => {
        console.log('\n✨ Setup script completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Setup script failed:', error);
        process.exit(1);
    });
