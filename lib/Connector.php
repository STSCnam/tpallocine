<?php

namespace PDO;

class Connector {
    /**
     * The database connector
     * 
     * @var PDO An instance of PDO connector
     */
    private $_db;

    /**
     * The Connection constructor
     * 
     * @param array|object $params A paramaters for the authentication
     * 
     * @throws Exception If the 1st argument is not a type of array or object
     * @throws Exception If PDO could not create a connexion
     * 
     * @return void
     */
    public function __construct($params) {
        if (gettype($params) === 'array')
            $params = (object)$params;
        else if (gettype($params) !== 'object')
            throw new \Exception(
                '1st argument must be a type of array or object.' .
                gettype($params) . ' given.'
            );

        if (!property_exists($params, 'db'))
            $params->{'db'} = '';

        if (!property_exists($params, 'port'))
            $params->{'port'} = 3306;

        try {
            $this->_db = new \PDO(
                "mysql:host=$params->host;dbname=$params->db;port=$params->port",
                $params->user,
                $params->passwd
            );
        } catch (\Exception $e) {
            die($e);
        }
    }

    /**
     * A simple prepared query method
     * 
     * @param string $sql An sql query
     * @param array $params An array of query parameters
     * 
     * @return array An array of retrieved datas
     */
    public function query(string $sql, array $params = []): array {
        $stmt = $this->_db->prepare($sql);

        foreach ($params as $key => $val) {
            $stmt->bindParam($key, $val);
        }

        $stmt->execute();

        $stmt->debugDumpParams();

        return $stmt->fetchAll(\PDO::FETCH_OBJ);
    }
}