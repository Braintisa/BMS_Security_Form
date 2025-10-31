<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Braintisa - GitHub Organization</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
            color: #ffffff;
            line-height: 1.6;
            padding: 40px 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%);
            border-radius: 20px;
            padding: 60px 40px;
            box-shadow: 0 20px 60px rgba(254, 194, 3, 0.2);
            border: 2px solid rgba(254, 194, 3, 0.1);
        }

        .header {
            text-align: center;
            margin-bottom: 50px;
            animation: fadeInDown 1s ease-out;
        }

        .logo {
            width: 180px;
            height: 180px;
            border-radius: 50%;
            margin: 0 auto 30px;
            display: block;
            border: 5px solid #FEC203;
            box-shadow: 0 10px 40px rgba(254, 194, 3, 0.4);
            transition: transform 0.3s ease;
            background: #000;
        }

        .logo:hover {
            transform: scale(1.05);
            box-shadow: 0 15px 50px rgba(254, 194, 3, 0.6);
        }

        h1 {
            font-size: 3.5em;
            font-weight: 800;
            margin-bottom: 15px;
            background: linear-gradient(90deg, #FEC203, #ffdb4d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 0 30px rgba(254, 194, 3, 0.3);
        }

        .tagline {
            font-size: 1.4em;
            color: #cccccc;
            font-weight: 300;
            letter-spacing: 1px;
        }

        .divider {
            height: 3px;
            background: linear-gradient(90deg, transparent, #FEC203, transparent);
            margin: 40px 0;
            box-shadow: 0 0 20px rgba(254, 194, 3, 0.5);
        }

        .content {
            animation: fadeInUp 1s ease-out 0.3s both;
        }

        .section {
            margin-bottom: 40px;
        }

        h2 {
            font-size: 2em;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
            color: #FEC203;
        }

        h2::before {
            content: '';
            width: 6px;
            height: 30px;
            background: linear-gradient(180deg, #FEC203, #ffa500);
            border-radius: 3px;
            box-shadow: 0 0 10px rgba(254, 194, 3, 0.5);
        }

        p {
            font-size: 1.1em;
            margin-bottom: 15px;
            color: #e0e0e0;
        }

        .features {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }

        .feature-card {
            background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
            padding: 30px;
            border-radius: 15px;
            border: 2px solid rgba(254, 194, 3, 0.2);
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
        }

        .feature-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, transparent, rgba(254, 194, 3, 0.1));
            opacity: 0;
            transition: opacity 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-10px);
            border-color: #FEC203;
            box-shadow: 0 15px 40px rgba(254, 194, 3, 0.3);
        }

        .feature-card:hover::before {
            opacity: 1;
        }

        .feature-icon {
            font-size: 2.5em;
            margin-bottom: 15px;
            position: relative;
            z-index: 1;
        }

        .feature-card h3 {
            font-size: 1.4em;
            margin-bottom: 10px;
            color: #FEC203;
            position: relative;
            z-index: 1;
        }

        .feature-card p {
            font-size: 1em;
            color: #cccccc;
            position: relative;
            z-index: 1;
        }

        .cta-section {
            text-align: center;
            margin-top: 50px;
            padding: 40px;
            background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
            border-radius: 15px;
            border: 2px solid rgba(254, 194, 3, 0.3);
        }

        .cta-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 30px;
        }

        .btn {
            padding: 15px 40px;
            font-size: 1.1em;
            font-weight: 600;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-decoration: none;
            display: inline-block;
        }

        .btn-primary {
            background: linear-gradient(135deg, #FEC203, #ffdb4d);
            color: #000000;
            box-shadow: 0 5px 20px rgba(254, 194, 3, 0.4);
            font-weight: 700;
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 30px rgba(254, 194, 3, 0.6);
            background: linear-gradient(135deg, #ffdb4d, #FEC203);
        }

        .btn-secondary {
            background: transparent;
            color: #FEC203;
            border: 2px solid #FEC203;
        }

        .btn-secondary:hover {
            background: rgba(254, 194, 3, 0.1);
            transform: translateY(-3px);
            box-shadow: 0 5px 20px rgba(254, 194, 3, 0.3);
        }

        .stats {
            display: flex;
            justify-content: space-around;
            margin: 40px 0;
            flex-wrap: wrap;
            gap: 20px;
        }

        .stat-item {
            text-align: center;
            padding: 20px;
            background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
            border-radius: 15px;
            border: 2px solid rgba(254, 194, 3, 0.2);
            min-width: 150px;
            transition: all 0.3s ease;
        }

        .stat-item:hover {
            border-color: #FEC203;
            transform: scale(1.05);
            box-shadow: 0 10px 30px rgba(254, 194, 3, 0.3);
        }

        .stat-number {
            font-size: 3em;
            font-weight: 800;
            background: linear-gradient(90deg, #FEC203, #ffdb4d);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .stat-label {
            font-size: 1.1em;
            color: #cccccc;
            margin-top: 5px;
        }

        strong {
            color: #FEC203;
        }

        @keyframes fadeInDown {
            from {
                opacity: 0;
                transform: translateY(-30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .container {
                padding: 40px 20px;
            }

            h1 {
                font-size: 2.5em;
            }

            .tagline {
                font-size: 1.1em;
            }

            .logo {
                width: 140px;
                height: 140px;
            }

            .cta-buttons {
                flex-direction: column;
                align-items: center;
            }

            .btn {
                width: 100%;
                max-width: 300px;
            }

            .stat-number {
                font-size: 2.5em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://scontent.fcmb11-1.fna.fbcdn.net/v/t39.30808-6/400064611_666619448975465_7150194893963688097_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeGs6MihFhZrEctp-I-lEtjzOlp9O40UbJk6Wn07jRRsmUtY8OE4DHfsYp7gp7D26_WrBSljD62VrQGtbOgVs3gh&_nc_ohc=njxa5aXo9NUQ7kNvwFmDqRm&_nc_oc=Adm7YoMW9UpBYBiQAWo2haVojMTU6rNgp0hDmRzQLkRkMHA1TpHWgU1PM3DVDjeo8j_doxDLc-3o67GklsPxLgKi&_nc_zt=23&_nc_ht=scontent.fcmb11-1.fna&_nc_gid=bXSZYA1_sgPWmEmp6W3jeA&oh=00_Afdxy2DeDxZVe43ArlwAEl8nHaYU59Q9RaCsQ57VapO3xQ&oe=690AA2F7" alt="Braintisa Logo" class="logo">
            <h1>BRAINTISA</h1>
            <p class="tagline">Innovating the Future with Intelligent Solutions</p>
        </div>

        <div class="divider"></div>

        <div class="content">
            <div class="section">
                <h2>About Us</h2>
                <p>Welcome to Braintisa's official GitHub organization! We are a forward-thinking technology company dedicated to developing cutting-edge software solutions that empower businesses and individuals to achieve their goals.</p>
                <p>Our team of passionate developers, designers, and innovators works tirelessly to create products that make a difference in the digital world.</p>
            </div>

            <div class="stats">
                <div class="stat-item">
                    <div class="stat-number">100+</div>
                    <div class="stat-label">Projects</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">50+</div>
                    <div class="stat-label">Contributors</div>
                </div>
                <div class="stat-item">
                    <div class="stat-number">1000+</div>
                    <div class="stat-label">Commits</div>
                </div>
            </div>

            <div class="section">
                <h2>What We Do</h2>
                <div class="features">
                    <div class="feature-card">
                        <div class="feature-icon">💻</div>
                        <h3>Software Development</h3>
                        <p>Building robust and scalable applications using modern technologies and best practices.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🤖</div>
                        <h3>AI & Machine Learning</h3>
                        <p>Leveraging artificial intelligence to create intelligent solutions for complex problems.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🌐</div>
                        <h3>Web Solutions</h3>
                        <p>Crafting beautiful and functional web experiences that engage and inspire users.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">📱</div>
                        <h3>Mobile Apps</h3>
                        <p>Developing innovative mobile applications for iOS and Android platforms.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">☁️</div>
                        <h3>Cloud Services</h3>
                        <p>Implementing cloud-native solutions for maximum scalability and reliability.</p>
                    </div>
                    <div class="feature-card">
                        <div class="feature-icon">🔒</div>
                        <h3>Security First</h3>
                        <p>Prioritizing security in every line of code to protect data and ensure trust.</p>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Our Values</h2>
                <p>🚀 <strong>Innovation:</strong> We constantly push boundaries and explore new technologies to stay ahead of the curve.</p>
                <p>🤝 <strong>Collaboration:</strong> We believe in the power of teamwork and open-source contribution.</p>
                <p>✨ <strong>Excellence:</strong> We strive for the highest quality in everything we create.</p>
                <p>🌍 <strong>Impact:</strong> We build solutions that make a positive difference in the world.</p>
            </div>

            <div class="cta-section">
                <h2>Join Our Journey</h2>
                <p>We're always looking for talented individuals to collaborate with. Whether you're a developer, designer, or tech enthusiast, there's a place for you at Braintisa.</p>
                <div class="cta-buttons">
                    <a href="#" class="btn btn-primary">Explore Our Projects</a>
                    <a href="#" class="btn btn-secondary">Get In Touch</a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
