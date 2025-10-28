package com.techsolutions.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.sql.Connection;

/**
 * Componente para probar la conexión a la base de datos al iniciar la aplicación
 * 
 * Ubicación: backend/src/main/java/com/techsolutions/backend/config/DatabaseConnectionTest.java
 */
@Component
public class DatabaseConnectionTest implements CommandLineRunner {
    
    @Autowired
    private DataSource dataSource;
    
    @Override
    public void run(String... args) {
        System.out.println("\n" + "=".repeat(80));
        System.out.println("🔍 INICIANDO PRUEBA DE CONEXIÓN A LA BASE DE DATOS");
        System.out.println("=".repeat(80));
        
        try (Connection connection = dataSource.getConnection()) {
            
            System.out.println("\n✅ ¡CONEXIÓN EXITOSA!");
            System.out.println("📊 Información de la base de datos:");
            System.out.println("   - URL: " + connection.getMetaData().getURL());
            System.out.println("   - Usuario: " + connection.getMetaData().getUserName());
            System.out.println("   - Driver: " + connection.getMetaData().getDriverName());
            System.out.println("   - Versión del driver: " + connection.getMetaData().getDriverVersion());
            System.out.println("   - Producto: " + connection.getMetaData().getDatabaseProductName());
            System.out.println("   - Versión del producto: " + connection.getMetaData().getDatabaseProductVersion());
            System.out.println("   - Conexión válida: " + connection.isValid(5));
            
            System.out.println("\n" + "=".repeat(80));
            System.out.println("✅ La aplicación está lista para usar la base de datos");
            System.out.println("=".repeat(80) + "\n");
            
        } catch (Exception e) {
            System.err.println("\n" + "=".repeat(80));
            System.err.println("❌ ERROR AL CONECTAR CON LA BASE DE DATOS");
            System.err.println("=".repeat(80));
            System.err.println("\n🔧 Detalles del error:");
            System.err.println("   Tipo: " + e.getClass().getSimpleName());
            System.err.println("   Mensaje: " + e.getMessage());
            
            System.err.println("\n💡 Posibles soluciones:");
            System.err.println("   1. Verifica que MySQL esté ejecutándose");
            System.err.println("   2. Confirma que la base de datos 'techsolutions' existe");
            System.err.println("   3. Verifica el usuario y contraseña en application.properties");
            System.err.println("   4. Asegúrate de que el puerto 3306 esté disponible");
            System.err.println("   5. Revisa que el conector MySQL esté en el classpath");
            
            System.err.println("\n📝 Configuración actual (application.properties):");
            System.err.println("   spring.datasource.url=jdbc:mysql://localhost:3306/techsolutions");
            System.err.println("   spring.datasource.username=root");
            System.err.println("   spring.datasource.password=(vacía)");
            
            System.err.println("\n" + "=".repeat(80));
            System.err.println("⚠️  LA APLICACIÓN CONTINUARÁ, PERO LA BD NO ESTÁ DISPONIBLE");
            System.err.println("=".repeat(80) + "\n");
            
            // Imprimir stack trace completo para debug
            e.printStackTrace();
        }
    }
}