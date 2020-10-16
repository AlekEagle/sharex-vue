require('./logger')('INFO');
const fs = require('fs'),
    dotenv = require('dotenv'),
    express = require('express'),
    cors = require('cors'),
    multer = require('multer'),
    Sequelize = require('sequelize'),
    session = require('client-sessions'),
    ratelimit = require('express-rate-limit'),
    fileType = require('file-type'),
    upload = multer(),
    Op = Sequelize.Op,
    ms = require('ms'),
    bcrypt = require('bcrypt'),
    history = require('connect-history-api-fallback'),
    crypto = require('crypto'),
    map = {
        'image/x-icon': 'ico',
        'text/html': 'html',
        'text/javascript': 'js',
        'application/json': 'json',
        'text/css': 'css',
        'image/png': 'png',
        'image/jpg': 'jpeg',
        'audio/wav': 'wav',
        'audio/mpeg': 'mp3',
        'image/svg+xml': 'svg',
        'application/pdf': 'pdf',
        'application/msword': 'doc',
        'image/gif': 'gif',
        'application/octet-stream': 'exe',
        'text/xml': 'xml',
        'video/mp4': 'mp4',
        'application/zip': 'zip',
        'text/plain': 'txt'
    },
    port = process.argv[2] || 3000;

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

dotenv.config();
const sequelize = new Sequelize({
    database: process.env.SERVERDB,
    username: process.env.SERVERUSERNAME,
    password: process.env.SERVERPASSWORD,
    host: process.env.SERVERIP,
    port: 5432,
    dialect: 'postgres',
    logging: false
});
class user extends Sequelize.Model { };
user.init({
    id: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    username: Sequelize.STRING(60),
    displayName: Sequelize.STRING,
    email: Sequelize.STRING(60),
    staff: Sequelize.STRING,
    password: Sequelize.STRING(2000),
    apiToken: Sequelize.STRING,
    domain: Sequelize.STRING,
    subdomain: Sequelize.STRING,
    bannedAt: Sequelize.DATE
}, {
    sequelize
});
user.sync({
    force: false
}).then(() => {
    console.log('Users synced to database successfully!');
}).catch(err => {
    console.error('an error occurred while performing this operation', err);
});
class uploads extends Sequelize.Model { };
uploads.init({
    filename: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    userid: Sequelize.STRING,
    size: Sequelize.INTEGER
}, {
    sequelize
});
uploads.sync({
    force: false
}).then(() => {
    console.log('Uploads synced to database successfully!');
}).catch(err => {
    console.error('an error occurred while performing this operation', err);
});
class actions extends Sequelize.Model { };
actions.init({
    type: Sequelize.INTEGER,
    by: Sequelize.STRING,
    to: Sequelize.STRING,
    addInfo: Sequelize.STRING(2000)
}, {
    sequelize
});
actions.sync({
    force: false
}).then(() => {
    console.log('Actions synced to database successfully!');
}).catch(err => {
    console.error('an error occurred while performing this operation', err);
});
class domains extends Sequelize.Model { };
domains.init({
    domain: {
        type: Sequelize.STRING,
        primaryKey: true
    },
    allowsSubdomains: Sequelize.BOOLEAN
}, {
    sequelize
});
domains.sync({
    force: false
}).then(() => {
    console.log('Domains synced to database successfully!');
}).catch(err => {
    console.error('an error occurred while performing this operation', err);
});
class instructions extends Sequelize.Model { };
instructions.init({
    name: {
        primaryKey: true,
        type: Sequelize.STRING
    },
    steps: Sequelize.ARRAY(Sequelize.STRING(2000)),
    filename: Sequelize.STRING(500),
    fileContent: Sequelize.STRING(5000),
    description: Sequelize.STRING(300),
    displayName: Sequelize.STRING
}, {
    sequelize
});
instructions.sync({
    force: false
}).then(() => {
    console.log('Instructions synced to database successfully!');
}).catch(err => {
    console.error('an error occurred whiel performing this operation', err);
});

function newString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(crypto.randomInt(possible.length)));

    return text;
}
const options = {
    key: fs.readFileSync('./alekeagle.com.key'),
    cert: fs.readFileSync('./alekeagle.com.pem')
}
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200
}
let https,
    app = require('express')();
if (process.env.DEBUG) {
    https = require('http');
} else {
    https = require('https');
}
app.use(cors(corsOptions));
app.engine('html', require('mustache-express')());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(history({
    rewrites: [
        {
            from: /^\/api\/.*$/,
            to: function (context) {
                return context.parsedUrl.path
            }
        }
    ]
}));
let server;
if (process.env.DEBUG) {
    server = https.createServer(app);
} else {
    server = https.createServer(options, app);
}

function tokenGen(id) {
    let now = Date.now().toString();
    return `${Buffer.from(id).toString('base64').replace(/==/g, '')}.${Buffer.from(now.split('').slice(now.length - 3, now.length).join('')).toString('base64')}.${Buffer.from(newString(24)).toString('base64')}`;

}

app.use(session({
    cookieName: 'session',
    secret: Math.random().toString(),
    duration: ms('30 days'),
    activeDuration: ms('1 hour'),
    cookie: {
        httpOnly: true,
        path: '/',
        secure: false,
        sameSite: 'lax'
    }
}));
function authenticate(req) {
    return new Promise((resolve, reject) => {
        if (!req.session.user && !req.headers.authorization) {
            reject();
        } else {
            if (req.session.user) {
                user.findOne({
                    where: {
                        id: req.session.user.id || 'none'
                    }
                }).then(u => {
                    if (!u) {
                        reject();
                    } else {
                        if (u.bannedAt !== null) {
                            reject();
                        } else {
                            resolve(u);
                        }
                    }
                }).catch(err => {
                    reject(err);
                });
            } else {
                user.findOne({
                    where: {
                        apiToken: req.headers.authorization.replace('Bearer ', '')
                    }
                }).then(u => {
                    if (!u) {
                        reject();
                    } else {
                        if (u.bannedAt !== null) {
                            reject();
                        } else {
                            resolve(u);
                        }
                    }
                }).catch(err => {
                    reject(err);
                });
            }
        }
    });
}
app.use('/api/', ratelimit({
    windowMs: ms('1 minute'), max: 50, keyGenerator: (req, res) => {
        authenticate(req).then(u => {
            return u.id;
        }, err => {
            return req.headers['x-forwarded-for'] || req.ip;
        });
    }
}));
app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'no-cache'
    });
    console.log(`${req.headers['x-forwarded-for'] || req.ip}: ${req.method} => ${req.protocol}://${req.headers.host}${req.url}`);
    next();
}, express.static('uploads', { acceptRanges: false }), (req, res, next) => {
    if (req.headers.host !== 'alekeagle.me' && !req.headers.host.includes('localhost') && !req.headers.host.includes('192.168.') && !req.headers.host.includes('127.0.0.1') && !req.headers.host.includes('::1') && !req.headers.host.includes('.local')) {
        res.redirect(301, 'https://alekeagle.me' + req.path);
        return;
    } else {
        next();
    }
});
app.all('/api/', (req, res) => {
    res.status(200).json({
        hello: 'world',
        version: '1.0.9'
    });
});
app.get('/api/users/', (req, res) => {
    authenticate(req).then(u => {
        let count = parseInt(req.query.count) || 50,
            offset = parseInt(req.query.offset) || 0;
        if (u.staff !== '') {
            user.findAll({
                offset,
                limit: count,
                order: [
                    ['createdAt', 'DESC']
                ]
            }).then(u => {
                if (u !== null) {
                    res.status(200).json(u.map(user => {
                        return {
                            id: user.id,
                            username: user.username,
                            displayName: user.displayName,
                            staff: user.staff,
                            createdAt: user.createdAt,
                            bannedAt: user.bannedAt
                        }
                    }));
                } else {
                    res.sendStatus(204);
                }
            }).catch(err => {
                res.sendStatus(500);
                console.error(err);
            });
        } else {
            res.sendStatus(403);
        }
    }).catch(() => {
        res.sendStatus(401);
    });
});
app.get('/api/brew-coffee/', (req, res) => {
    let ran = random(10000, 30000);
    setTimeout(() => {
        res.status(418).json({ error: 'I\'m a teapot.', body: 'The requested entitiy body is short and stout.', addInfo: 'Tip me over and pour me out.' });
    }, ran);
});
app.get('/api/user/:id', (req, res) => {
    authenticate(req).then(u => {
        if (!req.params.id) res.sendStatus(400);
        else {
            if ((u.staff === '' && u.id !== req.params.id) || u.staff !== '') {
                user.findOne({
                    where: {
                        id: req.params.id
                    }
                }).then(user => {
                    if (user === null) res.status(404).json({
                        error: 'Not found'
                    });
                    else res.status(200).json({
                        id: user.id,
                        username: user.username,
                        displayName: user.displayName,
                        staff: user.staff,
                        createdAt: user.createdAt,
                        bannedAt: user.bannedAt
                    });
                }, err => {
                    res.sendStatus(500);
                    console.error(err);
                });
            } else {
                res.sendStatus(403);
            }
        }
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.post('/api/user/', upload.none(), (req, res) => {
    let {
        name,
        email,
        password
    } = req.body;
    if (!name || !email || !password) {
        res.sendStatus(400);
        return;
    } else {
        let username = name.toLowerCase();
        user.findOne({
            where: {
                [Op.or]: [{
                    username
                },
                {
                    email
                }
                ]
            }
        }).then(u => {
            let now = new Date(Date.now());
            if (u === null) {
                bcrypt.hash(password, Math.floor(Math.random() * 10)).then(hashedPass => {
                    user.create({
                        id: now.getTime(),
                        username,
                        domain: 'alekeagle.me',
                        subdomain: '',
                        displayName: name,
                        email,
                        createdAt: now,
                        updatedAt: now,
                        password: hashedPass,
                        staff: '',
                        apiToken: tokenGen(now.getTime().toString())
                    }).then(newUser => {
                        req.session.user = newUser;
                        res.status(201).json(newUser);
                        actions.create({
                            type: 1,
                            by: newUser.id,
                            to: newUser.id
                        }).then(() => {
                            console.log('New user created');
                        });
                    }, err => {
                        res.sendStatus(500);
                        console.error(err);
                    });
                }, err => {
                    res.sendStatus(500);
                    console.error(err);
                });
            } else {
                res.sendStatus(401);
                return;
            }
        }, err => {
            res.sendStatus(500);
            console.error(err);
        });
    }
});
app.patch('/api/user/', upload.none(), (req, res) => {
    authenticate(req).then(u => {
        let {
            email,
            name,
            password,
            newPassword,
            id
        } = req.body;
        if (!(email || name || newPassword)) {
            res.sendStatus(400);
            return;
        } else {
            let username = name.toLowerCase();
            if (id) {
                if (u.staff === '') {
                    res.sendStatus(401);
                    return;
                } else {
                    user.findOne({
                        where: {
                            id
                        }
                    }).then(us => {
                        if (us === null) {
                            res.sendStatus(404);
                            return;
                        } else {
                            let now = new Date(Date.now());
                            bcrypt.hash(newPassword || password, Math.floor(Math.random() * 10)).then(hashedPass => {
                                us.update({
                                    email: email || u.email,
                                    displayName: name || u.displayName,
                                    username: username || u.username,
                                    updatedAt: now,
                                    password: hashedPass
                                }).then(updatedUser => {
                                    actions.create({
                                        type: 2,
                                        by: req.session.user.id,
                                        to: id
                                    }).then(() => {
                                        console.log('User updated');
                                    });
                                    let noPass = { ...updatedUser.toJSON(), password: null };
                                    res.status(200).json(noPass);
                                }, err => {
                                    res.sendStatus(500);
                                    console.error(err);
                                });
                            }, err => {
                                res.sendStatus(500);
                                console.error(err);
                            });
                        }
                    }, err => {
                        res.sendStatus(500);
                        console.error(err);
                    });
                }
            } else {
                if (!password) {
                    res.sendStatus(400);
                    return;
                }
                let now = new Date(Date.now());
                bcrypt.compare(password, u.password).then(match => {
                    if (match) {
                        bcrypt.hash(newPassword ? newPassword : password, Math.floor(Math.random() * 10)).then(hashedPass => {
                            us.update({
                                email: email || u.email,
                                displayName: name || u.displayName,
                                username: username || u.username,
                                updatedAt: now,
                                password: hashedPass
                            }).then(updatedUser => {
                                req.session.user = updatedUser;
                                actions.create({
                                    type: 2,
                                    by: updatedUser.id,
                                    to: updatedUser.id
                                }).then(() => {
                                    console.log('User updated');
                                });
                                let noPass = { ...updatedUser.toJSON(), password: null };
                                res.status(200).json(noPass);
                            }, err => {
                                res.sendStatus(500);
                                console.error(err);
                            });
                        }, err => {
                            res.sendStatus(500);
                            console.error(err);
                        });
                    }
                }, err => {
                    res.sendStatus(500);
                    console.error(err);
                });
            }
        }
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});

app.patch('/api/user/ban/', upload.none(), (req, res) => {
    authenticate(req).then(u => {
        if (u.staff !== '') {
            let { id, banned } = req.body;
            if (!id) {
                res.sendStatus(400);
                return;
            }
            user.findOne({ where: { id } }).then(usr => {
                usr.update({ bannedAt: banned ? new Date(Date.now()).toISOString() : null }).then(() => {
                    res.sendStatus(204);
                }, err => {
                    res.status(500).json({ error: 'Internal server error.' });
                    console.error('bruh ', err);
                });
            });
        } else res.sendStatus(403);
    });
});

app.delete('/api/user/', upload.none(), (req, res) => {
    authenticate(req).then(u => {
        let {
            password,
            id
        } = req.body;
        if (id) {
            if (u.staff !== '') {
                user.findOne({
                    where: {
                        id
                    }
                }).then(us => {
                    if (us !== null) {
                        us.destroy().then(() => {
                            actions.create({
                                type: 4,
                                by: req.session.user.id,
                                to: id
                            }).then(() => {
                                console.log('User Deleted');
                                res.sendStatus(200);
                            });
                        });
                    }
                });
            } else {
                res.sendStatus(403);
            }
        } else if (password) {
            bcrypt.compare(password, u.password).then(match => {
                if (match) {
                    u.destroy().then(() => {
                        actions.create({
                            type: 4,
                            by: req.session.user.id,
                            to: req.session.user.id
                        }).then(() => {
                            console.log('User Deleted');
                        });
                        req.session.reset();
                        res.sendStatus(200);
                    }, err => {
                        res.status(500).json({ error: 'Internal server error.' });
                        console.error(err);
                    });
                } else {
                    res.status(401).json({ error: 'Invalid password.' });
                    return;
                }
            }), err => {
                res.status(500).json({ error: 'Internal server error.' });
                console.error(err);
            };
        }
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.get('/api/logout/', (req, res) => {
    if (!req.session.user) {
        res.sendStatus(401);
        return;
    }
    req.session.reset();
    res.sendStatus(200);
});
app.post('/api/login/', upload.none(), (req, res) => {
    let {
        name,
        password
    } = req.body;
    if (!name || !password) {
        res.sendStatus(400);
        return;
    } else {
        name = name.toLowerCase();
        user.findOne({
            where: {
                [Op.or]: [{
                    username: name
                },
                {
                    email: name
                }
                ]
            }
        }).then(u => {
            if (u !== null) {
                if (u.bannedAt === null) {
                    bcrypt.compare(password, u.password).then(match => {
                        if (match) {
                            actions.create({
                                type: 5,
                                by: u.id,
                                to: u.id
                            }).then(() => {
                                console.log('User login');
                            });
                            req.session.user = u;
                            res.sendStatus(200);
                        } else {
                            res.status(401).json({ error: 'Invalid password.' });
                        }
                    }, err => {
                        res.status(500).json({ error: 'Internal server error.' });
                        console.error(err);
                    });
                } else {
                    res.status(401).json({ error: 'Banned.' });
                    return;
                }
            } else {
                res.status(404).json({ error: 'No account.' });
                return;
            }
        }, err => {
            res.status(500).json({ error: 'Internal server error.' });
            console.error(err);
        });
    }
});
app.get('/api/authenticate/', (req, res) => {
    authenticate(req).then(u => {
        let us = { ...u.toJSON() };
        delete us.password;
        res.status(200).json(us);
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.patch('/api/user/token/', upload.none(), (req, res) => {
    authenticate(req).then(u => {
        let {
            password,
            id
        } = req.body;
        if (password) {
            bcrypt.compare(password, u.password).then(match => {
                if (match) {
                    u.update({
                        apiToken: tokenGen(u.id)
                    }).then(u => {
                        req.session.user = u;
                        res.status(200).json({
                            token: u.apiToken
                        });
                        actions.create({
                            type: 3,
                            by: u.id,
                            to: u.id
                        }).then(() => {
                            console.log('API Token refreshed');
                        });
                    }, err => {
                        res.sendStatus(500);
                        console.error(err);
                    });
                } else {
                    res.sendStatus(401);
                }
            }, err => {
                res.sendStatus(500);
                console.error(err);
            });
        } else {
            if (u.staff !== '') {
                if (!id) {
                    res.sendStatus(400);
                } else {
                    user.findOne({
                        where: {
                            id
                        }
                    }).then(us => {
                        if (us) {
                            us.update({ apiToken: tokenGen(us.id) }).then(updatedUser => {
                                res.status(200).json({ token: updatedUser.apiToken });
                            }, err => {
                                res.sendStatus(500);
                                console.error(err);
                            })
                        }
                    })
                }
            } else {
                res.sendStatus(403);
            }
        }
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.get('/api/domains/', (req, res) => {
    authenticate(req).then(() => {
        domains.findAll().then(d => {
            res.status(200).json(d);
        });
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.patch('/api/user/domain/', upload.none(), (req, res) => {
    authenticate(req).then(u => {
        let {
            domain,
            subdomain,
            id
        } = req.body;
        subdomain = subdomain !== undefined ? subdomain.replace(/ /g, '-') : '';
        if (domain === 'alekeagle.com' && u.staff === '') {
            res.sendStatus(403);
            return;
        }
        domains.findOne({
            where: {
                domain
            }
        }).then(d => {
            if (d !== null) {
                if (d.allowsSubdomains ? true : (subdomain === undefined || subdomain === '')) {
                    if (!id) {
                        u.update({
                            domain,
                            subdomain
                        }).then(us => {
                            req.session.user = us;
                            res.status(200).json({
                                domain,
                                subdomain
                            });
                        });
                    } else {
                        if (u.staff !== '') {
                            user.findOne({
                                where: {
                                    id
                                }
                            }).then(us => {
                                if (us !== null) {
                                    us.update({ domain, subdomain }).then(() => {
                                        res.status(200).json({ domain, subdomain });
                                    }, err => {
                                        res.sendStatus(500);
                                        console.error(err);
                                    });
                                }
                            })
                        } else {
                            res.sendStatus(403);
                        }
                    }
                } else {
                    res.sendStatus(400);
                }
            } else {
                res.sendStatus(404);
            }
        }).catch(err => {
            res.sendStatus(500);
            console.error(err);
        });
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.get('/api/files/', (req, res) => {
    authenticate(req).then(u => {
        let {
            user
        } = req.query,
            count = parseInt(req.query.count) || 50,
            offset = parseInt(req.query.offset) || 0;
        if (!user) {
            uploads.findAll({
                offset,
                limit: count,
                order: [
                    ['updatedAt', 'DESC']
                ],
                where: {
                    userid: u.id
                }
            }).then(files => {
                if (files !== null || files.length !== 0) {
                    uploads.findAll({
                        where: {
                            userid: u.id
                        }
                    }).then(count => {
                        res.status(200).json({
                            count: count.length,
                            files
                        });
                    });
                } else {
                    res.status(200).json({ count: 0, files: [] });
                }
            });
        } else {
            if (u.staff !== '') {
                uploads.findAll({
                    offset,
                    limit: count,
                    order: [
                        ['updatedAt', 'DESC']
                    ],
                    where: {
                        userid: user
                    }
                }).then(files => {
                    if (files.length !== 0 && files !== null) {
                        uploads.findAll({
                            where: {
                                userid: user
                            }
                        }).then(count => {
                            res.status(200).json({
                                count: count.length,
                                files
                            });
                        });
                    } else {
                        res.status(200).json({ count: 0, files: [] });
                    }
                }).catch(err => {
                    res.sendStatus(500);
                    console.error(err);
                });
            } else {
                res.sendStatus(403);
            }
        }
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.get('/api/file/:file', (req, res) => {
    authenticate(req).then(u => {
        let {
            file
        } = req.params;
        if (!file) {
            res.sendStatus(400);
            return;
        }
        uploads.findOne({
            where: {
                [Op.or]: [{
                    filename: file
                }]
            }
        }).then(file => {
            if (file !== null) {
                if (file.userid === u.id) {
                    res.status(200).json(file);
                } else {
                    if (u.staff !== '') {
                        res.status(200).json(file);
                    } else {
                        res.sendStatus(403);
                        return;
                    }
                }
            } else {
                res.sendStatus(404);
                return;
            }
        });
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.get('/api/files/count/', (req, res) => {
    authenticate(req).then(u => {
        let { id } = req.body;
        uploads.findAll({
            where: {
                userid: id || u.id
            }
        }).then(files => {
            if (id) {
                if (u.staff !== '') res.status(200).send(files.length.toString());
                else res.sendStatus(403);
            } else res.status(200).send(files.length.toString());

        });
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.get('/api/setup/', (req, res) => {
    authenticate(req).then(u => {
        instructions.findAll().then(ins => {
            res.status(200).json(ins);
        })
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.get('/api/setup/:name/', (req, res) => {
    authenticate(req).then(u => {
        instructions.findOne({
            where: {
                name: req.params.name
            }
        }).then(ins => {
            if (ins !== null) {
                res.status(200).json(ins.toJSON());
            } else {
                res.sendStatus(404);
            }
        })
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.get('/api/setup/save/:name/', (req, res) => {
    authenticate(req).then(u => {
        instructions.findOne({
            where: {
                name: req.params.name
            }
        }).then(ins => {
            if (ins !== null) {
                res.set('Content-Disposition', `attachment; filename="${ins.filename}"`);
                res.status(200).send(ins.fileContent.replace(/(\{\{apiToken\}\})/g, u.apiToken));
            } else {
                res.sendStatus(404);
            }
        });
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});
app.delete('/api/file/:file', upload.none(), (req, res) => {
    authenticate(req).then(u => {
        let {
            file
        } = req.params;
        if (!file) {
            res.sendStatus(400);
            return;
        }
        uploads.findOne({
            where: {
                [Op.or]: [{
                    filename: file
                }]
            }
        }).then(file => {
            if (file !== null) {
                if (file.userid === u.id) {
                    fs.unlink(`uploads/${file.filename}`, err => {
                        if (err) {
                            res.sendStatus(500);
                            return;
                        } else {
                            file.destroy().then(() => {
                                res.sendStatus(200);
                                return;
                            }).catch(() => {
                                res.sendStatus(500);
                                return;
                            });
                        }
                    });
                } else if (u.staff !== '') {
                    fs.unlink(`uploads/${file.filename}`, err => {
                        if (err) {
                            res.sendStatus(500);
                            return;
                        } else {
                            file.destroy().then(() => {
                                res.sendStatus(200);
                                return;
                            }).catch(() => {
                                res.sendStatus(500);
                                return;
                            });
                        }
                    });
                } else {
                    res.sendStatus(403);
                    return;
                }
            } else {
                res.sendStatus(404);
                return;
            }
        }).catch(err => {
            res.sendStatus(500);
            console.error(err);
        });
    }).catch(() => {
        res.sendStatus(401);
    });
});
app.post('/upload/', upload.single('file'), (req, res) => {
    authenticate(req).then(u => {
        if (!req.file) {
            if (!req.body.file) {
                res.sendStatus(400);
                return;
            }
            let filename = newString(10),
                writeStream = fs.createWriteStream(`${__dirname}/uploads/${filename}.txt`);
            writeStream.write(req.body.file);
            writeStream.end();
            writeStream.destroy();
            res.status(201).end(`https://${u.subdomain ? `${u.subdomain}.` : ''}${u.domain}/${filename}.txt`);
            uploads.create({
                filename: `${filename}.txt`,
                userid: u.id,
                size: req.body.file.length
            });
        } else {
            fileType.fromBuffer(req.file.buffer.slice(0, fileType.minimumBytes)).then(ft => {
                let filename = newString(10),
                    writeStream = fs.createWriteStream(`${__dirname}/uploads/${filename}.${ft ? ft.ext : map[req.file.mimetype]}`);
                res.status(201).end(`https://${u.subdomain ? `${u.subdomain}.` : ''}${u.domain}/${filename}.${ft ? ft.ext : map[req.file.mimetype]}`);
                uploads.create({
                    filename: `${filename}.${ft ? ft.ext : map[req.file.mimetype]}`,
                    userid: u.id,
                    size: req.file.size
                }).then(() => {
                    writeStream.write(req.file.buffer);
                    writeStream.end();
                    writeStream.destroy();
                })
            });
        }
    }, err => {
        res.sendStatus(err ? 500 : 401);
    });
});

app.use((req, res, next) => {
    res.set({
        'Cache-Control': 'public, max-age=172800'
    });
    next();
}, express.static('./dist', { acceptRanges: false }));

server.listen(port);
console.log(`Server listening on port ${port}`);