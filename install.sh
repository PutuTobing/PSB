#!/bin/bash

# =============================================================================
# BTD Database-Login Application - Auto Installer
# =============================================================================
# Script untuk instalasi otomatis aplikasi di IP address manapun
# Usage: ./install.sh [IP_ADDRESS]
# Example: ./install.sh 172.16.31.50
# =============================================================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}"
    echo "=========================================="
    echo "  BTD Database-Login Auto Installer"
    echo "=========================================="
    echo -e "${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}➜ $1${NC}"
}

check_command() {
    if command -v $1 &> /dev/null; then
        print_success "$1 is installed"
        return 0
    else
        print_error "$1 is not installed"
        return 1
    fi
}

# Main Installation
main() {
    print_header
    
    # Get IP address from argument or detect automatically
    if [ -z "$1" ]; then
        SERVER_IP=$(hostname -I | awk '{print $1}')
        print_info "No IP provided, using detected IP: $SERVER_IP"
    else
        SERVER_IP=$1
        print_info "Using provided IP: $SERVER_IP"
    fi
    
    echo ""
    print_info "Installing application for IP: $SERVER_IP"
    echo ""
    
    # Step 1: Check prerequisites
    print_info "Step 1: Checking prerequisites..."
    
    MISSING_DEPS=0
    
    if ! check_command "docker"; then
        MISSING_DEPS=1
    fi
    
    if ! check_command "docker-compose"; then
        MISSING_DEPS=1
    fi
    
    if ! check_command "node"; then
        MISSING_DEPS=1
    fi
    
    if ! check_command "npm"; then
        MISSING_DEPS=1
    fi
    
    if [ $MISSING_DEPS -eq 1 ]; then
        echo ""
        print_error "Some dependencies are missing. Install them? (y/n)"
        read -r response
        if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
            print_info "Installing dependencies..."
            
            # Install Docker
            if ! command -v docker &> /dev/null; then
                print_info "Installing Docker..."
                curl -fsSL https://get.docker.com -o get-docker.sh
                sudo sh get-docker.sh
                sudo usermod -aG docker $USER
                rm get-docker.sh
                print_success "Docker installed"
            fi
            
            # Install Docker Compose
            if ! command -v docker-compose &> /dev/null; then
                print_info "Installing Docker Compose..."
                sudo apt install -y docker-compose
                print_success "Docker Compose installed"
            fi
            
            # Install Node.js & NPM
            if ! command -v node &> /dev/null; then
                print_info "Installing Node.js & NPM..."
                curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
                sudo apt-get install -y nodejs
                print_success "Node.js & NPM installed"
            fi
        else
            print_error "Installation cancelled. Please install dependencies manually."
            exit 1
        fi
    fi
    
    echo ""
    print_success "All prerequisites are met!"
    echo ""
    
    # Step 2: Start Docker containers
    print_info "Step 2: Starting MySQL & phpMyAdmin with Docker..."
    
    if docker ps | grep -q "PSB-db"; then
        print_info "Containers already running, skipping..."
    else
        docker-compose up -d
        print_success "Docker containers started"
        
        print_info "Waiting 30 seconds for MySQL to initialize..."
        sleep 30
    fi
    
    # Verify containers
    if docker ps | grep -q "mysql"; then
        print_success "MySQL container is running"
    else
        print_error "MySQL container failed to start"
        exit 1
    fi
    
    echo ""
    
    # Step 3: Setup Database
    print_info "Step 3: Setting up database..."
    
    print_info "Importing database schemas..."
    
    # Check if database already exists
    if docker exec PSB-db-1 mysql -uroot -prootpassword -e "USE auth_db;" 2>/dev/null; then
        print_info "Database already exists, skipping import..."
    else
        # Import schemas
        if [ -f "database/customers-schema.sql" ]; then
            docker exec -i PSB-db-1 mysql -uroot -prootpassword auth_db < database/customers-schema.sql 2>/dev/null || true
            print_success "customers-schema imported"
        fi
        
        if [ -f "database/pemasangan-schema.sql" ]; then
            docker exec -i PSB-db-1 mysql -uroot -prootpassword auth_db < database/pemasangan-schema.sql 2>/dev/null || true
            print_success "pemasangan-schema imported"
        fi
        
        if [ -f "database/manajemen-akun-setup.sql" ]; then
            docker exec -i PSB-db-1 mysql -uroot -prootpassword auth_db < database/manajemen-akun-setup.sql 2>/dev/null || true
            print_success "manajemen-akun-setup imported"
        fi
    fi
    
    echo ""
    
    # Step 4: Install Backend Dependencies
    print_info "Step 4: Installing backend dependencies..."
    
    cd backend
    if [ -d "node_modules" ]; then
        print_info "Backend dependencies already installed, skipping..."
    else
        npm install --silent
        print_success "Backend dependencies installed"
    fi
    cd ..
    
    echo ""
    
    # Step 5: Install Frontend Dependencies
    print_info "Step 5: Installing frontend dependencies..."
    
    cd frontend
    if [ -d "node_modules" ]; then
        print_info "Frontend dependencies already installed, skipping..."
    else
        npm install --silent
        print_success "Frontend dependencies installed"
    fi
    cd ..
    
    echo ""
    
    # Step 6: Configure Firewall
    print_info "Step 6: Configuring firewall..."
    
    if command -v ufw &> /dev/null; then
        print_info "Opening required ports..."
        sudo ufw allow 3000/tcp  # Backend
        sudo ufw allow 5173/tcp  # Vite Dev
        sudo ufw allow 4173/tcp  # Vite Preview
        sudo ufw allow 3306/tcp  # MySQL
        sudo ufw allow 8081/tcp  # phpMyAdmin
        print_success "Firewall configured"
    else
        print_info "UFW not found, skipping firewall configuration"
    fi
    
    echo ""
    
    # Installation Complete
    print_header
    print_success "Installation completed successfully!"
    echo ""
    
    print_info "Application URLs:"
    echo -e "  Frontend Dev:  ${GREEN}http://${SERVER_IP}:5173${NC}"
    echo -e "  Backend API:   ${GREEN}http://${SERVER_IP}:3000${NC}"
    echo -e "  phpMyAdmin:    ${GREEN}http://${SERVER_IP}:8081${NC}"
    echo -e "  MySQL:         ${GREEN}${SERVER_IP}:3306${NC}"
    echo ""
    
    print_info "Database Credentials:"
    echo "  Host: localhost"
    echo "  Port: 3306"
    echo "  User: root"
    echo "  Pass: rootpassword"
    echo "  DB:   auth_db"
    echo ""
    
    print_info "To start the application:"
    echo -e "  ${YELLOW}Terminal 1:${NC} cd backend && node server.js"
    echo -e "  ${YELLOW}Terminal 2:${NC} cd frontend && npm run dev"
    echo ""
    
    print_info "To start in background with PM2:"
    echo -e "  ${YELLOW}npm install -g pm2${NC}"
    echo -e "  ${YELLOW}cd backend && pm2 start server.js --name btd-backend${NC}"
    echo -e "  ${YELLOW}cd frontend && pm2 start npm --name btd-frontend -- run dev${NC}"
    echo ""
    
    print_info "First time setup:"
    echo "  1. Access http://${SERVER_IP}:5173"
    echo "  2. Click 'Daftar' to register first user"
    echo "  3. Login with registered credentials"
    echo ""
    
    print_success "Happy coding! 🚀"
    echo ""
}

# Run main installation
main "$@"
