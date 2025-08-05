The SQLAlchemy Engine is an object that handles the communication with the database.

The engine holds the network connection to that database.

To create an engine, just call create_engine with a url to the database.

if you set echo to true when creating the database engine, it will make the engine print all the executed statements, this can be helpful for debugging and learning.

when we run SQLModel.metadata.create_all , we create the tables in the database, and create the database file.

best practice, create your models in a models.py file, create the engine object in a file db.py, and create your main app and call SQLModel.metadata.create_all() in app.py, also import all the models before running the SQLModel.metadata.create_all().

The Session object sits on top of the engine, we create the session for every group of operations with the same database that belong together.

Each request creates and uses a new session, and once the request is done, we would close the session.

seperation of session ensures that all data is saved in a single batch, and that it will all succeed or all fail, but it wont leave the database in a broken state.

even if the result from the query is only one row, or it does not exist, the database will always return a table.

the WHERE, SELECT and the likes in sql are called clauses.

the same way we added where to a SQL statement, we can add where to the SQL model select statement to filter which rows are returned.

In a select statement, you can chain multiple where clauses together to filter more into the data.

or you can pass several exressions to a single .where() clause.

``` python

def select_heroes_age():
    with Session(engine) as session:
        statement = session.exec(select(Hero).where(Hero.age > 35, Hero.age < 40))
        print(statement)

```

you can also combine expressions using the or_ function. if we get an editor error for using comparisons values that are optional. we can use col which we can import from sqlmodel

statement = select(Hero).where(col(Hero.age) >= 35)


# Indexes - Optimizing Queries

Search operations in a database can be optimized using indexes, which work with the same principle as a binary search algorithm. An external table is created, which would be used to index the main table, this table will be managed automatically by the database. The column that will be used as an index will be ordered, that is sorted, as binary search algorithm only works on sorted data.


When you create an index in a SQL Database, the database takes care of updating it automatically whenever it's necessary.

use indexes when you know you will perform search operations on the column that will be used as an indexer, as indexes come with extra computational and storage costs.


``` sql

create index ix_hero_name
on hero (name)

```

In order to give an index for a model in sqlmodel, use the field function and set index to true on that column. The database automatically creates indexes for primary keys