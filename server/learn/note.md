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


## Many-To-Many Relationships

The link table used to define many to many relationships can also be called an association table, secondary table, junction table, intermediate table, join table, through table, relationship table, connection table, etc. In this case, the columns of the link table will be the primary key of that row.

To achieve this, create a link table, it is just like any other table, but the columns of this link table will have its primary key set to true, regardless of the number of columns, then when defining a relationship for the two main tables, inside the Relationship instance, after adding your back_populate, add a second parameter named link_model, and set it to the name of the table you created to link them together, the rows of this table usually contains the primary key of the two tables.

When updating or deleting from many to many relationships, we should remember that many to many relationships are often represented as lists, so in order for us to update a value, say we want to add, we can simply query the database for that table, which would return an object, then we can access the list that defines the relationship in that object, since we made use of the relationship constructor, and then we can simply append to that list, add the changes, and then commit the change. 



## Cascade Delete Relationships

What happens if we delete a team that has a relationship with heroes? Should those heroes be automatically deleted too? That's called a "cascade", because the initial deletion causes a cascade of other deletions. Should their team_id instead be set to NULL in the database?



## CORS

An origin is a combination of protocol, domain and port




dont end up as a film extra in someone else's life.

Get the things that should'nt be there out.

Work on yourself.

Repetition Repetition Repetition Repetition


## Security

JWT codifies a JSON object in a long dense string without spaces.

It is not encrypted, but it is signed, so you can verify if you emitted that toke or not.

You need to install pyjwt to generate and verify JWT tokens in python.

A jwt token consists of a header, payload and signature, with each base64url encoded and seperated by dots. The server verifies the token's integrity by checking the signature, which is created using a secret key and the heaer and payload.

The server verify's the JWT token by decoding it and recalculating the signature using the same algorithm and secret key. If the calculated signature matches the one in the token, the token is considered valid.

The server doesn't store session information; it relies on the token itself for authorization.

Bcrypt is the recommended password hashing algorithm.

to make use of passlib, you need to install it, to specify the algorithm you would use, in our case bcrypt, we install it this way using pip

``` shell

pip install "passlib[bcrypt]"

```

pyd is compiled python code. written usually in languages like C or C++ to provide support to python programs where speed is important.

In the context of hashing, a salt is a random string of characters added to a password before it's hashed. This makes the hashing process unique for each password even if two users have the same password.


You can generate a random secret key using openssl

``` shell

openssl rand -hex 32

```

This secret key will be used as part of the signature for generating the JWT tokens.


Time delta refers to a duration or difference between two points in time. It quantifies a time interval, such as the difference between two dates or times.


## Middleware

A middleware is a function that works with every request before it is processed by any specific path opeartion. And also with every response before returning it.


to create a middleware you use the decorator @app.middleware('http') on top a function.

The middleware function receives:

- The request
- A function call_next that will receive the request as a parameter

``` python

@app.middleware('http')
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers['X-Process-Time'] = str(process_time)
    return response

```

Middlewares are stacked with each other, and are executed in order of outermost to innermost for requests for response , innermost to outermonst.


# Python Discoveries

- The default dict class, gotten from the built-in collections module, is used to provide a default value for a nonexistent key in a dictionary, eliminating the need for checking if the key exists before using it.


# Paystack Integration

When working with paystack, you can initiate a transaction for a customer containing the customers email, amount, phone number, reference -> This should be unique, currency -> The currency in which amount should be charged, when a transaction is initialized, an access_code is returned, this access code can then be used by the frontend to provide the user interface for completing the transaction.

Then you need to verify the transaction status by using either webhooks or the verify transactions endpoint. when verifying status, you get the status and the amount, if the amount does not match the value of the service you are offering, dont deliver value to the customer.

When you initialize a transaction you can also provide a callback_url to be called after a transaction has been made, to redirect your user.
You can also have a cancel url, used to cancel a transaction, you can set this by adding a dictionary with key of cancel_action, and value of your url to cancel the transation, this will be called when the user wants to cancel a transaction.

Format of paystack callback response

https://siwes-web-app.vercel.app/?trxref=referenceno

When you receive the reference, you use it to call the verify endpoint


## Webhooks

A webhook is an automated, event driven message sent from one application to another over the internet when a specific event occurs, like a new order being placed or a file being uploaded. A webhook makes use of a push notification system. 
This allows for realtime communication between systems, enabling immediate updates and the triggering of automated workflows without constant polling for new data.

A webhook url is a post endpoint that a resource server sends updates to.

The and operator might not work well in sqlmodel, instead you can chain multiple where methods to help you perform an and operation. or pass the same expressions into the same where call seperated by a comma.