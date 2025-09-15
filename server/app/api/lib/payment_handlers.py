from api.deps import SessionDep
from model import Booking, Transaction
from sqlmodel import select
import paystack
from datetime import datetime

async def verify_payment(session: SessionDep, trxref: str, reference: str):
    response= paystack.Transaction.verify(
        reference=reference
    )
    transaction = session.exec(select(Transaction).where(Transaction.transaction_reference == reference)).one()
    booking = session.exec(select(Booking).where(Booking.id == transaction.booking_id)).one()
    transaction.transaction_status=response.data['status'] # type: ignore
    date_format= r'%Y-%m-%dT%H:%M:%S.%fZ'
    
    if transaction.transaction_status == 'success':
        transaction.paid_at=datetime.strptime(response.data['paid_at'], date_format) # type: ignore
        booking.is_paid = True
        session.add(transaction)    
        session.add(booking)
        session.commit()
        return 'Payment successful'
    
    del booking

    session.add(transaction)
    session.commit()
    return 'Payment pending or an error occured, contact the admin for more details'