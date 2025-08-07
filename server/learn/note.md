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

# Update data in sql

To update data in sql, make use of the update clause.

``` sql

update hero
set teamId = 1
where name = 'peter';

```

# Read Connected Data

A simple way of reading connected data in sql.

``` sql

select hero.id, hero.name, team.id
from hero, team
where hero.team_id = team.id

```
you can also read connected data by making use of join

``` sql

select hero.id, hero.name, team.name
from hero
join team
on hero.team_id = team_id

```

# Joining Tables with SQL and LEFT OUTER 

Imagine you are working with join on an sql database, how it works underneath is that, imagine you have two tables, the table you use for the from part, will be placed on the left hand side, and the table you use on the join part will be placed on the right hand side, then you tell the database on which condition it should join those two tables and give the results back. By default, only the rows from both left and right that match the condition will be returned.

But what if we want a table where even if the hero does not have a team, the hero will still be returned in the resulting table, just like saying keep everything in the left side of the table even if it does not match the condition. we can use the LEFT OUTER clause paired with the JOIN clause for this.

``` sql

select hero.id, hero.name, team.name
from hero
join team
left outer join team
on hero.team_id = team.id

```

# Update Data Connections

- You can add data connections using dot notations just like editing the properties of a python object.

# Deleting Data Connections

- In order to break a connection, all you have to do is assign None to the foreign key using regular dot notation.


## Relationships in SQLModel

Relationship attributes dont represent a column directly in the database, and their value is not a singular value like an integer. Their value is the entire object that is related.

when working with relationships, we dont need to commit both tables to the database when using session, commiting one will be enough, as sql alchemy knows that in order for it to properly define one database, it needs to define the other, so the other will be automatically created for you.

we can also remove relationships by setting it to None.



## Relationship back_populates

back_populate tells SQLModel that if something changes in this model, it should change that attribute in the other model, and it will work even before committing with the session ( that would force a refresh of the data ). That is lets say Hero, and Team table, if you add a backpopulate between hero and team, any changes made to team will reflect in hero, and any changes made in hero, will reflect in team, to make sure the data is up to date.

The string in back_populates is the name of the attribute in the other model, that will reference the current model.

The string in back_populates is always about the current model class you are editing. 


## Cascade Delete Relationships

What happens if we delete a team that has a relationship with heroes? Should those heroes be automatically deleted too? That's called a "cascade", because the initial deletion causes a cascade of other deletions. Should their team_id instead be set to NULL in the database?

