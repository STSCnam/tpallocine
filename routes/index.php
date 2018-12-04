<?php

use Enginr\Router;
use PDO\Connector;
use Enginr\System\System;

$env = json_decode(file_get_contents(__DIR__ . '/../env.json'));

$router = new Router();

$router->get('/', function($req, $res) use ($env) {
    $cnx = new Connector($env->database);

    $cinemas = $cnx->query('SELECT * FROM allocine.cinema');

    $res->render('index', [
        'cinemas' => $cinemas
    ]);
});

$router->get('/movies/:code', function($req, $res) use ($env) {
    $cnx = new Connector($env->database);

    $sql = 'SELECT t3.* ';
    $sql .= 'FROM allocine.cinema AS t1 ';
    $sql .= 'INNER JOIN allocine.projeter AS t2 ';
    $sql .= 'ON t1.codeCine = t2.numCinema ';
    $sql .= 'INNER JOIN allocine.film AS t3 ';
    $sql .= 'ON t2.numFilm = t3.codeFilm ';
    $sql .= 'WHERE t2.numCinema = :code';

    $movies = $cnx->query($sql, [
        'code' => $req->params->code
    ]);

    $res->send(json_encode($movies));
});

$router->get('/actors/:code', function($req, $res) use ($env) {
    $cnx = new Connector($env->database);

    $sql = 'SELECT t3.* ';
    $sql .= 'FROM allocine.film AS t1 ';
    $sql .= 'INNER JOIN allocine.jouer AS t2 ';
    $sql .= 'ON t1.codeFilm = t2.numFilm ';
    $sql .= 'INNER JOIN allocine.acteur AS t3 ';
    $sql .= 'ON t2.numActeur = t3.codeActeur ';
    $sql .= 'WHERE t2.numFilm = :code';

    $actors = $cnx->query($sql, [
        'code' => $req->params->code
    ]);

    $res->send(json_encode($actors));
});

$router->post('/vote/:code/:note', function($req, $res) use ($env) {
    $cnx = new Connector($env->database);

    $result = $cnx->query('UPDATE allocine.film SET totalVotes = totalVotes + ' . $req->params->note . ', nbVotes = nbVotes + 1 WHERE codeFilm = ' . $req->params->code);

    $res->send('OK');
});

return $router;